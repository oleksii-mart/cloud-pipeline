/*
 * Copyright 2023 EPAM Systems, Inc. (https://www.epam.com/)
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

package com.epam.pipeline.entity.billing;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ToolBillingMetrics {
    Long runsNumber;
    Long runsDuration;
    Long runsCost;
    Long runsDiskCost;
    Long runsComputeCost;

    public static ToolBillingMetrics empty() {
        return ToolBillingMetrics.builder()
                .runsNumber(0L)
                .runsDuration(0L)
                .runsCost(0L)
                .runsDiskCost(0L)
                .runsComputeCost(0L)
                .build();
    }
}
