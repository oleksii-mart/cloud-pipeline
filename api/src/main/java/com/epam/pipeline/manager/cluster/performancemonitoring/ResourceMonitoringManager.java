/*
 * Copyright 2017-2020 EPAM Systems, Inc. (https://www.epam.com/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.epam.pipeline.manager.cluster.performancemonitoring;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.epam.pipeline.entity.cluster.monitoring.ELKUsageMetric;
import com.epam.pipeline.entity.monitoring.NetworkConsumingRunAction;
import com.epam.pipeline.entity.monitoring.LongPausedRunAction;
import com.epam.pipeline.entity.pipeline.RunInstance;
import com.epam.pipeline.entity.pipeline.StopServerlessRun;
import com.epam.pipeline.entity.pipeline.TaskStatus;
import com.epam.pipeline.entity.pipeline.run.RunStatus;
import com.epam.pipeline.entity.run.PipelineRunEmergencyTermAction;
import com.epam.pipeline.manager.cluster.NodesManager;
import com.epam.pipeline.manager.pipeline.PipelineRunDockerOperationManager;
import com.epam.pipeline.manager.pipeline.RunStatusManager;
import com.epam.pipeline.manager.pipeline.StopServerlessRunManager;
import com.epam.pipeline.manager.preference.PreferenceManager;
import com.epam.pipeline.manager.preference.SystemPreferences;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import net.javacrumbs.shedlock.core.SchedulerLock;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.math3.util.Precision;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.epam.pipeline.common.MessageConstants;
import com.epam.pipeline.common.MessageHelper;
import com.epam.pipeline.dao.monitoring.MonitoringESDao;
import com.epam.pipeline.entity.cluster.InstanceType;
import com.epam.pipeline.entity.monitoring.IdleRunAction;
import com.epam.pipeline.entity.notification.NotificationType;
import com.epam.pipeline.entity.pipeline.PipelineRun;
import com.epam.pipeline.entity.utils.DateUtils;
import com.epam.pipeline.manager.cluster.InstanceOfferManager;
import com.epam.pipeline.manager.notification.NotificationManager;
import com.epam.pipeline.manager.pipeline.PipelineRunManager;
import com.epam.pipeline.manager.scheduling.AbstractSchedulingManager;

import javax.annotation.PostConstruct;

/**
 * A service component for monitoring resource usage.
 * Polls cpu usage of running pipelines statistics from Kubernetes on a configured schedule.
 * <p>
 * Performs the following actions:
 * If a pipeline's resource usage for a configured timeout is below a configured threshold,
 * a notification will be sent. If resource usage is still low during a configured action timeout, one of configured
 * actions will be taken: notify, force pause of force stop of a  run.
 */
@Service
@ConditionalOnProperty("monitoring.elasticsearch.url")
@Slf4j
public class ResourceMonitoringManager extends AbstractSchedulingManager {

    public static final String UTILIZATION_LEVEL_LOW = "IDLE";
    public static final String NETWORK_CONSUMING_LEVEL_HIGH = "NETWORK_PRESSURE";
    public static final String UTILIZATION_LEVEL_HIGH = "PRESSURE";
    public static final String TRUE_VALUE_STRING = "true";

    private final ResourceMonitoringManagerCore core;

    @Autowired
    public ResourceMonitoringManager(final ResourceMonitoringManagerCore core) {
        this.core = core;
    }

    @PostConstruct
    public void init() {
        scheduleFixedDelaySecured(core::monitorResourceUsage, SystemPreferences.SYSTEM_RESOURCE_MONITORING_PERIOD,
                "Resource Usage Monitoring");
    }

    public void monitorResourceUsage() {
        core.monitorResourceUsage();
    }

    @Component
    static class ResourceMonitoringManagerCore {

        private static final int MILLIS = 1000;
        private static final double PERCENT = 100.0;
        private static final double ONE_THOUSANDTH = 0.001;
        private static final long ONE = 1L;
        private static final String WORK_FINISHED_TAG = "WORK_FINISHED";
        public static final String CP_TERMINATE_RUN_ON_CLEANUP_TIMEOUT_MIN_PARAM =
                "CP_TERMINATE_RUN_ON_CLEANUP_TIMEOUT_MIN";

        private final PipelineRunManager pipelineRunManager;
        private final RunStatusManager runStatusManager;
        private final PipelineRunDockerOperationManager pipelineRunDockerOperationManager;
        private final NotificationManager notificationManager;
        private final MonitoringESDao monitoringDao;
        private final MessageHelper messageHelper;
        private final PreferenceManager preferenceManager;
        private final StopServerlessRunManager stopServerlessRunManager;
        private final InstanceOfferManager instanceOfferManager;
        private final NodesManager nodesManager;


        @Autowired
        ResourceMonitoringManagerCore(final PipelineRunManager pipelineRunManager,
                                      final PipelineRunDockerOperationManager pipelineRunDockerOperationManager,
                                      final NotificationManager notificationManager,
                                      final MonitoringESDao monitoringDao,
                                      final MessageHelper messageHelper,
                                      final PreferenceManager preferenceManager,
                                      final StopServerlessRunManager stopServerlessRunManager,
                                      final InstanceOfferManager instanceOfferManager,
                                      final RunStatusManager runStatusManager,
                                      final NodesManager nodesManager) {
            this.pipelineRunManager = pipelineRunManager;
            this.pipelineRunDockerOperationManager = pipelineRunDockerOperationManager;
            this.messageHelper = messageHelper;
            this.notificationManager = notificationManager;
            this.monitoringDao = monitoringDao;
            this.preferenceManager = preferenceManager;
            this.stopServerlessRunManager = stopServerlessRunManager;
            this.instanceOfferManager = instanceOfferManager;
            this.runStatusManager = runStatusManager;
            this.nodesManager = nodesManager;
        }

        @Scheduled(cron = "0 0 0 ? * *")
        @SchedulerLock(name = "ResourceMonitoringManager_removeOldIndices", lockAtMostForString = "PT1H")
        public void removeOldIndices() {
            monitoringDao.deleteIndices(preferenceManager.getPreference(
                    SystemPreferences.SYSTEM_RESOURCE_MONITORING_STATS_RETENTION_PERIOD));
        }

        @SchedulerLock(name = "ResourceMonitoringManager_monitorResourceUsage", lockAtMostForString = "PT10M")
        public void monitorResourceUsage() {
            List<PipelineRun> runs = pipelineRunManager.loadRunningPipelineRuns();
            processIdleRuns(runs);
            processHighNetworkConsumingRuns(runs);
            processOverloadedRuns(runs);
            processStuckRuns(runs);
            processPausingResumingRuns();
            processServerlessRuns();
            processLongPausedRuns();
        }

        private void processPausingResumingRuns() {
            final List<PipelineRun> runsWithStatuses = pipelineRunManager
                    .loadRunsByStatuses(Arrays.asList(TaskStatus.PAUSING, TaskStatus.RESUMING))
                    .stream()
                    .map(run -> pipelineRunManager.loadPipelineRunWithRestartedRuns(run.getId()))
                    .collect(Collectors.toList());
            if (CollectionUtils.isNotEmpty(runsWithStatuses)) {
                notificationManager.notifyStuckInStatusRuns(runsWithStatuses);
            }
        }

        private void processOverloadedRuns(final List<PipelineRun> runs) {
            final Map<String, PipelineRun> running = groupedByNode(runs);
            final int timeRange = preferenceManager.getPreference(
                    SystemPreferences.SYSTEM_MONITORING_METRIC_TIME_RANGE);
            final Map<ELKUsageMetric, Double> thresholds = getThresholds();
            log.debug(messageHelper.getMessage(MessageConstants.DEBUG_RUN_METRICS_REQUEST,
                    "MEMORY, DISK ", running.size(), String.join(", ", running.keySet())));

            final LocalDateTime now = DateUtils.nowUTC();
            final Map<ELKUsageMetric, Map<String, Double>> metrics = Stream.of(ELKUsageMetric.MEM, ELKUsageMetric.FS)
                    .collect(Collectors.toMap(metric -> metric, metric ->
                            monitoringDao.loadMetrics(metric, running.keySet(),
                                    now.minusMinutes(timeRange + ONE), now)));

            log.debug(messageHelper.getMessage(MessageConstants.DEBUG_MEMORY_METRICS, metrics.entrySet().stream()
                    .map(e -> e.getKey().getName() + ": { " + e.getValue().entrySet().stream()
                            .map(metric -> metric.getKey() + ":" + metric.getValue())
                            .collect(Collectors.joining(", ")) + " }"
                    )
                    .collect(Collectors.joining("; "))));

            final List<Pair<PipelineRun, Map<ELKUsageMetric, Double>>> runsToNotify = running.entrySet()
                    .stream()
                    .map(nodeAndRun -> matchRunAndMetrics(metrics, nodeAndRun))
                    .filter(pod -> isPodUnderPressure(pod.getValue(), thresholds))
                    .collect(Collectors.toList());

            final List<PipelineRun> runsToUpdateTags = getRunsToUpdatePressuredTags(running, runsToNotify);
            notificationManager.notifyHighResourceConsumingRuns(runsToNotify, NotificationType.HIGH_CONSUMED_RESOURCES);
            pipelineRunManager.updateRunsTags(runsToUpdateTags);
        }

        private void processStuckRuns(final List<PipelineRun> runs) {
            log.info("Start emergency runs termination cycle.");
            final PipelineRunEmergencyTermAction termAction =
                    preferenceManager.getPreference(SystemPreferences.LAUNCH_RUN_EMERGENCY_TERM_ACTION);
            final Integer defaultRunEmergencyTermDelay = preferenceManager.getPreference(
                    SystemPreferences.LAUNCH_RUN_EMERGENCY_TERM_DELAY_MIN);

            if (termAction.equals(PipelineRunEmergencyTermAction.DISABLED)) {
                log.info("Emergency run termination disabled. Will not check running runs!");
                return;
            }

            CollectionUtils.emptyIfNull(runs).stream()
                .filter(run -> MapUtils.emptyIfNull(run.getTags()).containsKey(WORK_FINISHED_TAG))
                .forEach(run -> {
                    final int emergencyTerminationDelay = Optional.ofNullable(
                        MapUtils.emptyIfNull(run.getEnvVars()).get(CP_TERMINATE_RUN_ON_CLEANUP_TIMEOUT_MIN_PARAM)
                    ).map(v -> {
                        try {
                            return Integer.parseInt(v);
                        } catch (NumberFormatException e) {
                            log.warn("Can't parse CP_TERMINATE_RUN_ON_CLEANUP_TIMEOUT_MIN: {} for run: {}." +
                                     " Will use default one!", v, run.getId());
                            return null;
                        }
                    }).orElse(defaultRunEmergencyTermDelay);

                    try {
                        final LocalDateTime workFinishedTime =
                                DateUtils.strToUTCDate(run.getTags().get(WORK_FINISHED_TAG));
                        if (workFinishedTime.isBefore(DateUtils.nowUTC().minusMinutes(emergencyTerminationDelay))) {
                            log.warn("Run: {} marked as finished on: {} and should be stopped forcefully, action: {}",
                                    run.getId(), workFinishedTime, termAction);
                            performEmergencyTermAction(run, termAction);
                        } else {
                            log.debug("Run: {} marked as finished on: {}, waiting period: {} min. Skipping.",
                                    run.getId(), workFinishedTime, emergencyTerminationDelay);
                        }
                    } catch (DateTimeParseException e) {
                        log.error("Problem to parse date while processing possibly stuck run: {}", run.getId());
                    }
                });
        }

        private void performEmergencyTermAction(final PipelineRun run,
                                                final PipelineRunEmergencyTermAction termAction) {
            switch (termAction) {
                case STOP:
                    pipelineRunManager.updatePipelineStatusIfNotFinal(run.getId(), TaskStatus.STOPPED);
                    break;
                case TERMINATE_NODE:
                    final String nodeName = Optional.ofNullable(run.getInstance())
                            .map(RunInstance::getNodeName).orElse(null);
                    if (nodeName != null) {
                        nodesManager.terminateNode(nodeName);
                    } else {
                        log.error("Can't get node name for run: {}", run.getId());
                    }
                    break;
                default:
                    break;
            }
        }

        private Map<String, PipelineRun> groupedByNode(final List<PipelineRun> runs) {
            return runs.stream()
                    .filter(r -> {
                        final boolean hasNodeName = Objects.nonNull(r.getInstance())
                                && Objects.nonNull(r.getInstance().getNodeName());
                        if (!hasNodeName) {
                            log.debug(messageHelper.getMessage(
                                    MessageConstants.DEBUG_RUN_HAS_NOT_NODE_NAME, r.getId()));
                        }
                        return hasNodeName;
                    })
                    .collect(Collectors.toMap(r -> r.getInstance().getNodeName(), r -> r));
        }

        private List<PipelineRun> getRunsToUpdatePressuredTags(
                final Map<String, PipelineRun> running,
                final List<Pair<PipelineRun, Map<ELKUsageMetric, Double>>> runsToNotify) {
            final Set<Long> runsIdToNotify = runsToNotify
                    .stream()
                    .map(p -> p.getLeft().getId())
                    .collect(Collectors.toSet());
            final Stream<PipelineRun> runsToAddTag = running.values()
                    .stream()
                    .filter(r -> runsIdToNotify.contains(r.getId()))
                    .filter(r -> !r.hasTag(UTILIZATION_LEVEL_HIGH))
                    .peek(r -> {
                        r.addTag(UTILIZATION_LEVEL_HIGH, TRUE_VALUE_STRING);
                        Optional.ofNullable(getTimestampTag(UTILIZATION_LEVEL_HIGH))
                                .ifPresent(tag -> r.addTag(tag, DateUtils.nowUTCStr()));
                    });
            final Stream<PipelineRun> runsToRemoveTag = running.values()
                    .stream()
                    .filter(r -> !runsIdToNotify.contains(r.getId()))
                    .filter(r -> r.hasTag(UTILIZATION_LEVEL_HIGH))
                    .peek(r -> {
                        r.removeTag(UTILIZATION_LEVEL_HIGH);
                        r.removeTag(getTimestampTag(UTILIZATION_LEVEL_HIGH));
                    });
            return Stream.concat(runsToAddTag, runsToRemoveTag).collect(Collectors.toList());
        }

        private Pair<PipelineRun, Map<ELKUsageMetric, Double>> matchRunAndMetrics(
                final Map<ELKUsageMetric, Map<String, Double>> metrics,
                final Map.Entry<String, PipelineRun> podAndRun) {
            final Map<ELKUsageMetric, Double> podMetrics = metrics.entrySet()
                    .stream()
                    .collect(HashMap::new,
                        (m, e) -> m.put(e.getKey(), e.getValue().get(podAndRun.getKey())), Map::putAll);

            return new ImmutablePair<>(podAndRun.getValue(), podMetrics);
        }

        private boolean isPodUnderPressure(final Map<ELKUsageMetric, Double> podMetrics,
                                           final Map<ELKUsageMetric, Double> thresholds) {
            return thresholds.entrySet()
                    .stream()
                    .anyMatch(
                            metricThreshold -> {
                                Double podValue = podMetrics.get(metricThreshold.getKey());
                                return podValue != null && !Double.isInfinite(podValue) &&
                                        Precision.compareTo(podValue, metricThreshold.getValue(), ONE_THOUSANDTH) > 0;
                            }
                    );
        }

        private Map<ELKUsageMetric, Double> getThresholds() {
            final HashMap<ELKUsageMetric, Double> result = new HashMap<>();
            result.put(ELKUsageMetric.MEM,
                    preferenceManager.getPreference(SystemPreferences.SYSTEM_MEMORY_THRESHOLD_PERCENT) / PERCENT);
            result.put(ELKUsageMetric.FS,
                    preferenceManager.getPreference(SystemPreferences.SYSTEM_DISK_THRESHOLD_PERCENT) / PERCENT);
            return result;
        }

        private void processIdleRuns(final List<PipelineRun> runs) {
            final Map<String, PipelineRun> running = groupedByNode(runs);

            final int idleTimeout = preferenceManager.getPreference(SystemPreferences.SYSTEM_MAX_IDLE_TIMEOUT_MINUTES);

            final Map<String, PipelineRun> notProlongedRuns = running.entrySet().stream()
                    .filter(e -> Optional.ofNullable(e.getValue().getProlongedAtTime())
                            .map(timestamp -> DateUtils.nowUTC()
                                    .isAfter(timestamp.plusMinutes(idleTimeout)))
                            .orElse(Boolean.FALSE))
                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

            log.debug(messageHelper.getMessage(MessageConstants.DEBUG_RUN_METRICS_REQUEST,
                    "CPU", notProlongedRuns.size(), String.join(", ", notProlongedRuns.keySet())));

            final LocalDateTime now = DateUtils.nowUTC();
            final Map<String, Double> cpuMetrics = monitoringDao.loadMetrics(ELKUsageMetric.CPU,
                    notProlongedRuns.keySet(), now.minusMinutes(idleTimeout + ONE), now);
            log.debug(messageHelper.getMessage(MessageConstants.DEBUG_CPU_RUN_METRICS_RECEIVED,
                    cpuMetrics.entrySet().stream().map(e -> e.getKey() + ":" + e.getValue())
                            .collect(Collectors.joining(", ")))
            );

            final double idleCpuLevel = preferenceManager.getPreference(
                    SystemPreferences.SYSTEM_IDLE_CPU_THRESHOLD_PERCENT) / PERCENT;
            final int actionTimeout = preferenceManager.getPreference(
                    SystemPreferences.SYSTEM_IDLE_ACTION_TIMEOUT_MINUTES);
            final IdleRunAction action = IdleRunAction.valueOf(preferenceManager
                    .getPreference(SystemPreferences.SYSTEM_IDLE_ACTION));

            processRuns(notProlongedRuns, cpuMetrics, idleCpuLevel, actionTimeout, action);
        }

        private void processRuns(Map<String, PipelineRun> running, Map<String, Double> cpuMetrics,
                                 double idleCpuLevel, int actionTimeout, IdleRunAction action) {
            final List<PipelineRun> runsToUpdateNotificationTime = new ArrayList<>(running.size());
            final List<Pair<PipelineRun, Double>> runsToNotify = new ArrayList<>(running.size());
            final List<PipelineRun> runsToUpdateTags = new ArrayList<>(running.size());
            final Map<String, InstanceType> instanceTypeMap = instanceOfferManager.getAllInstanceTypes().stream()
                    .collect(Collectors.toMap(InstanceType::getName,
                    Function.identity(), (t1, t2) -> t1));
            for (Map.Entry<String, PipelineRun> entry : running.entrySet()) {
                PipelineRun run = entry.getValue();
                Double metric = cpuMetrics.get(entry.getKey());
                if (metric != null) {
                    InstanceType type = instanceTypeMap.getOrDefault(run.getInstance().getNodeType(),
                            InstanceType.builder().vCPU(1).build());
                    double cpuUsageRate = metric / MILLIS / type.getVCPU();
                    if (Precision.compareTo(cpuUsageRate, idleCpuLevel, ONE_THOUSANDTH) < 0) {
                        processIdleRun(run, actionTimeout, action, runsToNotify,
                                runsToUpdateNotificationTime, cpuUsageRate, runsToUpdateTags);
                    } else if (run.getLastIdleNotificationTime() != null) { // No action is longer needed, clear timeout
                        log.debug(messageHelper.getMessage(MessageConstants.DEBUG_RUN_NOT_IDLED,
                                run.getPodId(), cpuUsageRate));
                        processFormerIdleRun(run, runsToUpdateNotificationTime, runsToUpdateTags);
                    }
                }
            }
            notificationManager.notifyIdleRuns(runsToNotify, NotificationType.IDLE_RUN);
            pipelineRunManager.updatePipelineRunsLastNotification(runsToUpdateNotificationTime);
            pipelineRunManager.updateRunsTags(runsToUpdateTags);
        }

        private void processIdleRun(PipelineRun run, int actionTimeout, IdleRunAction action,
                                    List<Pair<PipelineRun, Double>> pipelinesToNotify,
                                    List<PipelineRun> runsToUpdateNotificationTime, Double cpuUsageRate,
                                    List<PipelineRun> runsToUpdateTags) {
            if (shouldPerformActionOnIdleRun(run, actionTimeout)) {
                performActionOnIdleRun(run, action, cpuUsageRate, pipelinesToNotify,
                        runsToUpdateNotificationTime, runsToUpdateTags);
                return;
            }
            if (Objects.isNull(run.getLastIdleNotificationTime())) {
                run.addTag(UTILIZATION_LEVEL_LOW, TRUE_VALUE_STRING);
                Optional.ofNullable(getTimestampTag(UTILIZATION_LEVEL_LOW))
                        .ifPresent(tag -> run.addTag(tag, DateUtils.nowUTCStr()));
                runsToUpdateTags.add(run);
                run.setLastIdleNotificationTime(DateUtils.nowUTC());
                runsToUpdateNotificationTime.add(run);
            }
            pipelinesToNotify.add(new ImmutablePair<>(run, cpuUsageRate));
            log.info(messageHelper.getMessage(MessageConstants.INFO_RUN_IDLE_NOTIFY, run.getPodId(), cpuUsageRate));
        }

        private boolean shouldPerformActionOnIdleRun(final PipelineRun run, final int actionTimeout) {
            return Objects.nonNull(run.getLastIdleNotificationTime()) &&
                    run.getLastIdleNotificationTime().isBefore(DateUtils.nowUTC().minusMinutes(actionTimeout));
        }

        private void processFormerIdleRun(final PipelineRun run, final List<PipelineRun> runsToUpdateNotificationTime,
                                          final List<PipelineRun> runsToUpdateTags) {
            run.setLastIdleNotificationTime(null);
            run.removeTag(UTILIZATION_LEVEL_LOW);
            run.removeTag(getTimestampTag(UTILIZATION_LEVEL_LOW));
            runsToUpdateNotificationTime.add(run);
            runsToUpdateTags.add(run);
        }

        private void performActionOnIdleRun(final PipelineRun run, IdleRunAction action,
                                            final double cpuUsageRate,
                                            final List<Pair<PipelineRun, Double>> pipelinesToNotify,
                                            final List<PipelineRun> runsToUpdate,
                                            final List<PipelineRun> runsToUpdateTags) {
            log.info(messageHelper.getMessage(MessageConstants.INFO_RUN_IDLE_ACTION, run.getPodId(), cpuUsageRate,
                    action));
            switch (action) {
                case PAUSE:
                    if (run.getInstance().getSpot()) {
                        performNotify(run, cpuUsageRate, pipelinesToNotify);
                    } else {
                        performPause(run, cpuUsageRate);
                    }

                    break;
                case PAUSE_OR_STOP:
                    if (run.getInstance().getSpot()) {
                        performStop(run, cpuUsageRate, runsToUpdateTags);
                    } else {
                        performPause(run, cpuUsageRate);
                    }

                    break;
                case STOP:
                    performStop(run, cpuUsageRate, runsToUpdateTags);
                    break;
                default:
                    performNotify(run, cpuUsageRate, pipelinesToNotify);
            }

            runsToUpdate.add(run);
        }

        private void performNotify(PipelineRun run, double cpuUsageRate,
                                   List<Pair<PipelineRun, Double>> pipelinesToNotify) {
            run.setLastIdleNotificationTime(DateUtils.nowUTC());
            pipelinesToNotify.add(new ImmutablePair<>(run, cpuUsageRate));
        }

        private void processHighNetworkConsumingRuns(final List<PipelineRun> runs) {
            final double bandwidthLimit = preferenceManager.getPreference(
                    SystemPreferences.SYSTEM_POD_BANDWIDTH_LIMIT);
            final int actionTimeout = preferenceManager.getPreference(
                    SystemPreferences.SYSTEM_POD_BANDWIDTH_ACTION_BACKOFF_PERIOD);
            final NetworkConsumingRunAction action = NetworkConsumingRunAction.valueOf(preferenceManager
                    .getPreference(SystemPreferences.SYSTEM_POD_BANDWIDTH_ACTION));

            if (bandwidthLimit <= 0) {
                log.debug(messageHelper.getMessage(MessageConstants.DEBUG_RUN_NOT_NETWORK_CONSUMING_DISABLED));
                return;
            }

            final Map<String, PipelineRun> running = groupedByNode(runs);

            final int bandwidthLimitTimeout = preferenceManager.getPreference(
                    SystemPreferences.SYSTEM_MAX_POD_BANDWIDTH_LIMIT_TIMEOUT_MINUTES);

            log.debug(messageHelper.getMessage(MessageConstants.DEBUG_RUN_METRICS_REQUEST,
                    "NETWORK", running.size(), String.join(", ", running.keySet())));

            final LocalDateTime now = DateUtils.nowUTC();
            final Map<String, Double> networkMetrics = monitoringDao.loadMetrics(ELKUsageMetric.NETWORK,
                    running.keySet(), now.minusMinutes(bandwidthLimitTimeout + ONE), now);
            log.debug(messageHelper.getMessage(MessageConstants.DEBUG_NETWORK_RUN_METRICS_RECEIVED,
                    networkMetrics.entrySet().stream().map(e -> e.getKey() + ":" + e.getValue())
                            .collect(Collectors.joining(", ")))
            );

            processHighNetworkConsumingRuns(running, networkMetrics, bandwidthLimit, actionTimeout, action);
        }

        private void processHighNetworkConsumingRun(PipelineRun run, int actionTimeout,
                                                    NetworkConsumingRunAction action,
                                                    List<Pair<PipelineRun, Double>> runsToNotify,
                                                    List<PipelineRun> runsToUpdateNotificationTime,
                                                    Double bandwidth, List<PipelineRun> runsToUpdateTags) {
            if (Objects.isNull(run.getLastNetworkConsumptionNotificationTime())) {
                run.addTag(NETWORK_CONSUMING_LEVEL_HIGH, TRUE_VALUE_STRING);
                Optional.ofNullable(getTimestampTag(NETWORK_CONSUMING_LEVEL_HIGH))
                        .ifPresent(tag -> run.addTag(tag, DateUtils.nowUTCStr()));
                runsToUpdateTags.add(run);

                log.info(messageHelper.getMessage(MessageConstants.INFO_RUN_HIGH_NETWORK_CONSUMPTION_NOTIFY,
                        run.getPodId(), bandwidth));

                performHighNetworkConsumingNotify(run, bandwidth, runsToNotify, runsToUpdateNotificationTime);
            } else if (shouldPerformActionOnNetworkConsumingRun(run, actionTimeout)) {
                performActionOnNetworkConsumingRun(run, action, bandwidth, runsToNotify,
                        runsToUpdateNotificationTime);
            }

        }

        private void processHighNetworkConsumingRuns(Map<String, PipelineRun> running,
                                                     Map<String, Double> networkMetrics,
                                                     double bandwidthLimit,
                                                     int actionTimeout, NetworkConsumingRunAction action) {
            final List<PipelineRun> runsToUpdateNotificationTime = new ArrayList<>(running.size());
            final List<Pair<PipelineRun, Double>> runsToNotify = new ArrayList<>(running.size());
            final List<PipelineRun> runsToUpdateTags = new ArrayList<>(running.size());
            for (Map.Entry<String, PipelineRun> entry : running.entrySet()) {
                PipelineRun run = entry.getValue();
                Double bandwidth = networkMetrics.get(entry.getKey());
                if (bandwidth != null) {
                    if (bandwidth >= bandwidthLimit) {
                        processHighNetworkConsumingRun(run, actionTimeout, action, runsToNotify,
                                runsToUpdateNotificationTime, bandwidth, runsToUpdateTags);
                    } else if (run.getLastNetworkConsumptionNotificationTime() != null) {
                        // No action is longer needed, clear timeout
                        log.debug(messageHelper.getMessage(MessageConstants.DEBUG_RUN_NOT_NETWORK_CONSUMING,
                                run.getPodId(), bandwidth));
                        processFormerHighNetworkConsumingRun(run, runsToUpdateNotificationTime, runsToUpdateTags);
                    }
                }
            }
            notificationManager.notifyHighNetworkConsumingRuns(runsToNotify,
                    NotificationType.HIGH_CONSUMED_NETWORK_BANDWIDTH);
            pipelineRunManager.updatePipelineRunsLastNotification(runsToUpdateNotificationTime);
            pipelineRunManager.updateRunsTags(runsToUpdateTags);
        }

        private void processFormerHighNetworkConsumingRun(final PipelineRun run,
                                                          final List<PipelineRun> runsToUpdateNotificationTime,
                                                          final List<PipelineRun> runsToUpdateTags) {
            run.setLastNetworkConsumptionNotificationTime(null);
            run.removeTag(NETWORK_CONSUMING_LEVEL_HIGH);
            run.removeTag(getTimestampTag(NETWORK_CONSUMING_LEVEL_HIGH));
            runsToUpdateNotificationTime.add(run);
            runsToUpdateTags.add(run);
        }

        private boolean shouldPerformActionOnNetworkConsumingRun(final PipelineRun run, final int actionTimeout) {
            return  actionTimeout > 0 && Objects.nonNull(run.getLastNetworkConsumptionNotificationTime()) &&
                    run.getLastNetworkConsumptionNotificationTime()
                            .isBefore(DateUtils.nowUTC().minusMinutes(actionTimeout));
        }

        private void performActionOnNetworkConsumingRun(final PipelineRun run,
                                                        final NetworkConsumingRunAction action,
                                                        final double bandwidth,
                                                        final List<Pair<PipelineRun, Double>> runsToNotify,
                                                        final List<PipelineRun> runsToUpdateNotificationTime) {
            log.info(messageHelper.getMessage(MessageConstants.INFO_RUN_HIGH_NETWORK_CONSUMPTION_ACTION,
                    run.getPodId(), bandwidth, action.name()));
            switch (action) {
                case LIMIT_BANDWIDTH:
//                    TODO
                    break;
                case NOTIFY:
                default:
                    performHighNetworkConsumingNotify(run, bandwidth, runsToNotify, runsToUpdateNotificationTime);
                    break;
            }
        }

        private void performHighNetworkConsumingNotify(final PipelineRun run, final double networkBandwidthLevel,
                                                       final List<Pair<PipelineRun, Double>> pipelinesToNotify,
                                                       final List<PipelineRun> runsToUpdateNotificationTime) {
            run.setLastNetworkConsumptionNotificationTime(DateUtils.nowUTC());
            pipelinesToNotify.add(new ImmutablePair<>(run, networkBandwidthLevel));
            runsToUpdateNotificationTime.add(run);
        }

        private void performStop(final PipelineRun run,
                                 final double cpuUsageRate,
                                 final List<PipelineRun> runsToUpdateTags) {
            if (run.isNonPause() || run.isClusterRun()) {
                log.debug(messageHelper.getMessage(MessageConstants.DEBUG_RUN_IDLE_SKIP_CHECK, run.getPodId()));
                return;
            }
            pipelineRunManager.stop(run.getId());
            final String stopTag = preferenceManager.getPreference(SystemPreferences.SYSTEM_RUN_TAG_STOP_REASON);
            if (StringUtils.isNotBlank(stopTag)) {
                run.addTag(stopTag, "IDLE_RUN");
                runsToUpdateTags.add(run);
            }
            notificationManager.notifyIdleRuns(Collections.singletonList(new ImmutablePair<>(run, cpuUsageRate)),
                    NotificationType.IDLE_RUN_STOPPED);
        }

        private void performPause(PipelineRun run, double cpuUsageRate) {
            if (run.isNonPause() || run.isClusterRun()) {
                log.debug(messageHelper.getMessage(MessageConstants.DEBUG_RUN_IDLE_SKIP_CHECK, run.getPodId()));
                return;
            }
            if (preferenceManager.findPreference(SystemPreferences.SYSTEM_MAINTENANCE_MODE).orElse(false)) {
                log.debug(messageHelper.getMessage(MessageConstants.ERROR_RUN_OPERATION_FORBIDDEN));
                return;
            }
            run.setLastIdleNotificationTime(null);
            pipelineRunDockerOperationManager.pauseRun(run.getId(), true);
            notificationManager.notifyIdleRuns(Collections.singletonList(new ImmutablePair<>(run, cpuUsageRate)),
                    NotificationType.IDLE_RUN_PAUSED);
        }

        private void processServerlessRuns() {
            final List<StopServerlessRun> activeServerlessRuns = ListUtils.emptyIfNull(
                    stopServerlessRunManager.loadActiveServerlessRuns());
            activeServerlessRuns.stream()
                    .filter(this::serverlessRunIsExpired)
                    .forEach(run -> pipelineRunManager.stopServerlessRun(run.getId()));
        }

        private boolean serverlessRunIsExpired(final StopServerlessRun run) {
            final Long timeout = getTimeoutMinutes(run);
            return Objects.nonNull(timeout) && run.getLastUpdate().isBefore(LocalDateTime.now().minusMinutes(timeout));
        }

        private Long getTimeoutMinutes(final StopServerlessRun run) {
            return Objects.nonNull(run.getStopAfter())
                    ? run.getStopAfter()
                    : preferenceManager.getPreference(SystemPreferences.LAUNCH_SERVERLESS_STOP_TIMEOUT).longValue();
        }

        private void processLongPausedRuns() {
            final LongPausedRunAction action = LongPausedRunAction.valueOf(preferenceManager.getPreference(
                    SystemPreferences.SYSTEM_LONG_PAUSED_ACTION));
            final int actionTimeout = preferenceManager.getPreference(
                    SystemPreferences.SYSTEM_LONG_PAUSED_ACTION_TIMEOUT_MINUTES);

            final List<PipelineRun> pausedRuns = pipelineRunManager
                    .loadRunsByStatuses(Collections.singletonList(TaskStatus.PAUSED));
            if (CollectionUtils.isEmpty(pausedRuns)) {
                return;
            }
            final Map<Long, List<RunStatus>> statuses = runStatusManager.loadRunStatus(
                    pausedRuns.stream()
                    .map(PipelineRun::getId)
                    .collect(Collectors.toList()), false);

            pausedRuns.forEach(run -> run.setRunStatuses(statuses.get(run.getId())));
            processLongPausedRuns(pausedRuns, action, actionTimeout);
        }

        private void processLongPausedRuns(final List<PipelineRun> pausedRuns,
                                           final LongPausedRunAction action,
                                           final int actionTimeout) {
            if (CollectionUtils.isEmpty(pausedRuns)) {
                return;
            }
            if (LongPausedRunAction.STOP.equals(action)) {
                final Map<Boolean, List<PipelineRun>> runs = pausedRuns.stream()
                        .collect(Collectors.partitioningBy(
                            run -> !run.isNonPause() && isReadyForAction(run, actionTimeout)));
                final List<PipelineRun> runsToStop = ListUtils.emptyIfNull(runs.get(true));
                final List<PipelineRun> terminatedRuns =
                        ListUtils.emptyIfNull(notificationManager.notifyLongPausedRunsBeforeStop(runsToStop))
                        .stream()
                        .map(run -> pipelineRunManager.terminateRun(run.getId()))
                        .collect(Collectors.toList());

                final String stopTag = preferenceManager.getPreference(SystemPreferences.SYSTEM_RUN_TAG_STOP_REASON);
                if (StringUtils.isNotBlank(stopTag)) {
                    terminatedRuns.forEach(run -> run.addTag(stopTag, "LONG_PAUSED"));
                    pipelineRunManager.updateRunsTags(terminatedRuns);
                }

                final List<PipelineRun> runsToNotify = ListUtils.emptyIfNull(runs.get(false));
                notificationManager.notifyLongPausedRuns(runsToNotify);
            } else {
                notificationManager.notifyLongPausedRuns(pausedRuns);
            }
        }

        private boolean isReadyForAction(final PipelineRun pausedRun, final int actionTimeout) {
            return ListUtils.emptyIfNull(pausedRun.getRunStatuses()).stream()
                    .filter(status -> TaskStatus.PAUSED.equals(status.getStatus()))
                    .max(Comparator.comparing(RunStatus::getTimestamp))
                    .map(status ->
                            status.getTimestamp().isBefore(DateUtils.nowUTC().minusMinutes(actionTimeout)))
                    .orElse(false);
        }

        private String getTimestampTag(final String tagName) {
            final String suffix = preferenceManager.getPreference(SystemPreferences.SYSTEM_RUN_TAG_DATE_SUFFIX);
            return StringUtils.isNotEmpty(suffix) ? tagName + suffix : null;
        }
    }
}
