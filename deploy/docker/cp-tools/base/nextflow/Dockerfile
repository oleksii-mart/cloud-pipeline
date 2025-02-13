# Copyright 2017-2019 EPAM Systems, Inc. (https://www.epam.com/)
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

ARG BASE_IMAGE=nvidia/cuda:11.3.1-cudnn8-runtime-ubuntu18.04
FROM ${BASE_IMAGE}

# Common applications
RUN apt update && \
    apt install -y wget \
                   git \
                   curl \
                   openjdk-11-jdk \
                    graphviz \
                   python && \
    curl https://cloud-pipeline-oss-builds.s3.amazonaws.com/tools/pip/2.7/get-pip.py | python -

# Stick to a specific version, as the installation script at get.nextflow.io may be upgraded without a notification
# NXF_VER will be considered in the installation script
ENV NXF_VER="22.10.7"
ENV NXF_HOME_ROOT="/opt/nextflow"
ENV NXF_HOME="$NXF_HOME_ROOT/$NXF_VER"

# Redefine default analysis and input location to /common, which will be shared across nodes. These values can be also changed during startup
ENV ANALYSIS_DIR="/common/analysis"
ENV INPUT_DIR="/common/input"

# Install nextflow itlself into $NXF_HOME
RUN mkdir -p $NXF_HOME && \
    cd $NXF_HOME_ROOT && \
    curl -fsSL get.nextflow.io | bash && \
    mv nextflow "$NXF_HOME/nextflow"

ADD nextflow /usr/bin/nextflow
RUN chmod +x /usr/bin/nextflow
