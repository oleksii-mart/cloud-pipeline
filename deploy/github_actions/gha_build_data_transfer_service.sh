#!/bin/bash

# Copyright 2017-2023 EPAM Systems, Inc. (https://www.epam.com/)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -e

CLOUD_PIPELINE_BUILD_NUMBER=$(($CLOUD_PIPELINE_BUILD_NUMBER_SEED+$GITHUB_RUN_NUMBER))

./gradlew -PbuildNumber=${CLOUD_PIPELINE_BUILD_NUMBER}.${GITHUB_SHA} \
          -Pprofile=release \
          data-transfer-service:build \
          data-transfer-service:bundleWindows \
          data-transfer-service:bundleLinux \
          --no-daemon

ls -lh data-transfer-service/build/libs/data-transfer-service.jar \
       data-transfer-service/build/distributions/data-transfer-service-windows.zip \
       data-transfer-service/build/distributions/data-transfer-service-linux.zip

if [ "$GITHUB_REPOSITORY" == "epam/cloud-pipeline" ]; then
    aws s3 cp --no-progress data-transfer-service/build/libs/data-transfer-service.jar s3://cloud-pipeline-oss-builds/temp/$CLOUD_PIPELINE_BUILD_NUMBER/data-transfer-service.jar
    aws s3 cp --no-progress data-transfer-service/build/distributions/data-transfer-service-windows.zip s3://cloud-pipeline-oss-builds/temp/$CLOUD_PIPELINE_BUILD_NUMBER/data-transfer-service-windows.zip
    aws s3 cp --no-progress data-transfer-service/build/distributions/data-transfer-service-linux.zip s3://cloud-pipeline-oss-builds/temp/$CLOUD_PIPELINE_BUILD_NUMBER/data-transfer-service-linux.zip
fi
