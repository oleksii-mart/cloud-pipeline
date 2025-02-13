/*
 * Copyright 2017-2019 EPAM Systems, Inc. (https://www.epam.com/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.epam.pipeline.mapper.region;

import com.epam.pipeline.controller.vo.region.AWSRegionDTO;
import com.epam.pipeline.controller.vo.region.AbstractCloudRegionDTO;
import com.epam.pipeline.controller.vo.region.AzureRegionDTO;
import com.epam.pipeline.controller.vo.region.GCPRegionDTO;
import com.epam.pipeline.controller.vo.region.LocalRegionDTO;
import com.epam.pipeline.entity.region.AbstractCloudRegion;
import com.epam.pipeline.entity.region.AbstractCloudRegionCredentials;
import com.epam.pipeline.entity.region.AwsRegion;
import com.epam.pipeline.entity.region.AwsRegionCredentials;
import com.epam.pipeline.entity.region.AzureRegion;
import com.epam.pipeline.entity.region.AzureRegionCredentials;
import com.epam.pipeline.entity.region.CloudProvider;
import com.epam.pipeline.entity.region.GCPRegion;
import com.epam.pipeline.entity.region.LocalRegion;
import com.epam.pipeline.entity.region.LocalRegionCredentials;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
@SuppressWarnings("unchecked")
public interface CloudRegionMapper {

    String UNSUPPORTED_CLOUD_PROVIDER = "Unsupported cloud provider: ";

    default AbstractCloudRegionDTO toCloudRegionDTO(AbstractCloudRegion cloudRegion) {
        return getMapper(cloudRegion).toDTO(this, cloudRegion);
    }

    default AbstractCloudRegion toEntity(AbstractCloudRegionDTO dto) {
        return getMapper(dto).toEntity(this, dto);
    }

    default AbstractCloudRegionCredentials toCredentialsEntity(AbstractCloudRegionDTO dto) {
        return getCredentialsMapper(dto).toEntity(this, dto);
    }

    AWSRegionDTO toAwsRegionDTO(AwsRegion awsRegion);

    AzureRegionDTO toAzureRegionDTO(AzureRegion azureRegion);

    GCPRegionDTO toGCPRegionDTO(GCPRegion gcpRegion);

    LocalRegionDTO toLocalregionDTO(LocalRegion localRegion);

    AwsRegion toAwsRegion(AWSRegionDTO awsRegion);

    AzureRegion toAzureRegion(AzureRegionDTO azureRegion);

    GCPRegion toGCPRegion(GCPRegionDTO azureRegion);

    LocalRegion toLocalRegion(LocalRegionDTO localRegion);

    AzureRegionCredentials toAzureRegionCredentials(AzureRegionDTO azureRegion);

    AwsRegionCredentials toAwsRegionCredentials(AWSRegionDTO awsRegion);

    LocalRegionCredentials toLocalRegionCredentials(LocalRegionDTO localRegion);

    default RegionMapperHelper getMapper(AbstractCloudRegion region) {
        return getMapperByType(region.getProvider());
    }

    default RegionMapperHelper getMapper(AbstractCloudRegionDTO region) {
        return getMapperByType(region.getProvider());
    }

    default RegionCredentialsMapperHelper getCredentialsMapper(AbstractCloudRegionDTO region) {
        switch (region.getProvider()) {
            case AWS: return new RegionCredentialsMapperHelper.AwsCredentialsMapper();
            case AZURE: return new RegionCredentialsMapperHelper.AzureCredentialsMapper();
            case GCP: return new RegionCredentialsMapperHelper.NullCredentialsMapper();
            case LOCAL: return new RegionCredentialsMapperHelper.LocalCredentialsMapper();
            default: throw new IllegalArgumentException(UNSUPPORTED_CLOUD_PROVIDER + region.getProvider());
        }
    }

    default RegionMapperHelper getMapperByType(CloudProvider provider) {
        switch (provider) {
            case AWS: return new RegionMapperHelper.AWSRegionMapper();
            case GCP: return new RegionMapperHelper.GCPRegionMapper();
            case AZURE: return new RegionMapperHelper.AzureRegionMapper();
            case LOCAL: return new RegionMapperHelper.LocalRegionMapper();
            default: throw new IllegalArgumentException(UNSUPPORTED_CLOUD_PROVIDER + provider);
        }
    }
}