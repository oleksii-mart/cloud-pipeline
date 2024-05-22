#!/bin/bash

# Copyright 2017-2021 EPAM Systems, Inc. (https://www.epam.com/)
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
pip install awscli

_BUILD_DOCKER_IMAGE="${CP_DOCKER_DIST_SRV}lifescience/cloud-pipeline:python2.7-centos6" ./gradlew -PbuildNumber=${APPVEYOR_BUILD_NUMBER}.${APPVEYOR_REPO_COMMIT} \
          -Pprofile=release pipe-cli:buildLinux \
          --no-daemon -x :pipe-cli:test
mv pipe-cli/dist/dist-file/pipe pipe-cli/dist/dist-file/pipe-el6
mv pipe-cli/dist/dist-folder/pipe.tar.gz pipe-cli/dist/dist-folder/pipe-el6.tar.gz

./gradlew -PbuildNumber=${APPVEYOR_BUILD_NUMBER}.${APPVEYOR_REPO_COMMIT} \
          -Pprofile=release \
          pipe-cli:buildLinux pipe-cli:buildWin \
          --no-daemon \
          -x :pipe-cli:test

cd pipe-cli
DIST_TGZ_NAME=pipe.$APPVEYOR_BUILD_NUMBER.tar.gz
tar -zcf $DIST_TGZ_NAME dist
if [ "$APPVEYOR_REPO_NAME" == "epam/cloud-pipeline" ]; then
    if [ "$APPVEYOR_REPO_BRANCH" == "develop" ] || [ "$APPVEYOR_REPO_BRANCH" == "master" ] || [[ "$APPVEYOR_REPO_BRANCH" == "release/"* ]] || [[ "$APPVEYOR_REPO_BRANCH" == "stage/"* ]] || [[ "$APPVEYOR_REPO_BRANCH" == "f_appveyor_modular_deployment" ]]; then
        aws s3 cp $DIST_TGZ_NAME s3://cloud-pipeline-oss-builds/temp/
    fi
fi
