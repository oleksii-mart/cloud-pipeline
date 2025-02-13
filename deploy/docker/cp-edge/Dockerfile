# Copyright 2017-2022 EPAM Systems, Inc. (https://www.epam.com/)
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

# Building 'maintenance' page
FROM node:20-alpine AS maintenance

ENV CP_MAINTENANCE_PUBLIC_URL="/maintenance"

WORKDIR /etc/maintenance

COPY ./maintenance/ui/package*.json ./

RUN npm ci

COPY ./maintenance/ui .

RUN npm run build

FROM rockylinux:8

ENV PATH $PATH:/usr/local/openresty/bin:/usr/local/openresty/nginx/sbin:/etc/ssh-proxy/node-v20.17.0-linux-x64/bin/

# This shall be set during deployment
ENV JWT_PUB_KEY /etc/nginx/jwt-public-key.pem

# Install common
RUN yum install -y python2 \
                   python3 \
                   unzip \
                   git \
                   curl \
                   wget \
                   epel-release \
                   zlib-devel \
                   cronie \
                   sshpass \
                   perl \
                   nc \
                   gcc \
                   make \
                   bzip2 \
                   bzip2-devel \
                   xz \
                   xz-devel \
                   ncurses-devel \
                   procps \
                   patch && \
    yum group install -y "Development Tools" && \
    yum clean all && \
    ln -sf /usr/bin/python2 /usr/bin/python && \
    curl https://cloud-pipeline-oss-builds.s3.amazonaws.com/tools/pip/2.7/get-pip.py | python - && \
    pip install rsa==4.0 \
                pykube==0.15.0

# Openresty + http_connect module
RUN yum install -y  pcre-devel \
                    openssl-devel \
                    perl-Digest-MD5

RUN cd /tmp && \
    git clone https://github.com/sidoruka/ngx_http_proxy_connect_module.git && \
    cd ngx_http_proxy_connect_module && \
    git checkout b41a20b6cb4e38a5cf30369f9a58f1e9d1ff97fc

RUN     cd /tmp && \
        wget -q https://s3.amazonaws.com/cloud-pipeline-oss-builds/tools/nginx/openresty-1.15.8.1.tar.gz && \
        tar -zxf openresty-1.15.8.1.tar.gz && \
        rm -f openresty-1.15.8.1.tar.gz && \
        cd openresty-1.15.8.1 && \
        ./configure --with-stream_ssl_preread_module --with-http_sub_module --add-module=/tmp/ngx_http_proxy_connect_module -j$(nproc) && \
        patch -d build/nginx-1.15.8/ -p 1 < /tmp/ngx_http_proxy_connect_module/patch/proxy_connect_rewrite_101504.patch && \
        make -j$(nproc) && \
        make install

# Install LUA JWT
# FIXME: fork the distribution
RUN opm get cdbattags/lua-resty-jwt=0.2.0
# Install LUA HTTP Client
RUN opm get pintsized/lua-resty-http=0.12
# Install URL parsing library
RUN opm get 3scale/lua-resty-url=0.3.3

# Configure cron and sync routes script
ADD	crontab.sh /etc/sync-routes/crontab.sh
ADD sync-routes.sh /etc/sync-routes/sync-routes.sh
ADD	sync-routes.py /etc/sync-routes/sync-routes.py
RUN touch /var/log/sync-routes.log && \
    touch /var/log/wetty.log

# Configure nginx
## Main config file
ADD	nginx.conf /etc/nginx/nginx.conf
ADD endpoints-config /etc/nginx/endpoints-config
ADD static /etc/nginx/static
ADD mime.types /etc/nginx/mime.types

## Logs dir
RUN mkdir -p /etc/nginx/logs/

## Routes direcotory
RUN	mkdir -p /etc/nginx/sites-enabled/

## Cookie validation
ADD validate_cookie.lua /etc/nginx/validate_cookie.lua
ADD validate_cookie_ssh.lua /etc/nginx/validate_cookie_ssh.lua
ADD validate_cookie_dav.lua /etc/nginx/validate_cookie_dav.lua
ADD validate_cookie_fsbrowser.lua /etc/nginx/validate_cookie_fsbrowser.lua
ADD create_cookie_dav.lua /etc/nginx/create_cookie_dav.lua
ADD validate_proxy_auth.lua /etc/nginx/validate_proxy_auth.lua
COPY maintenance*.lua /etc/nginx/

## DAV auth page
ADD dav-auth /etc/nginx/dav/webdav/auth-sso

# Install SSH proxy
## Install node.js
RUN mkdir -p /etc/ssh-proxy/  && \
    cd /etc/ssh-proxy/ && \
    wget -q https://cloud-pipeline-oss-builds.s3.amazonaws.com/tools/nodejs/node-v20.17.0-linux-x64.tar.xz && \
    tar xfJ node-v20.17.0-linux-x64.tar.xz && \
    rm -f node-v20.17.0-linux-x64.tar.xz

## Install wetty
ADD wetty /etc/ssh-proxy/wetty
RUN cd /etc/ssh-proxy/wetty && \
    npm install && \
    cd /

## Install maintenance page
COPY --from=maintenance /etc/maintenance/build /etc/nginx/maintenance

# Configure maintenance cron and refresh script
COPY maintenance/scripts/* /etc/maintenance/
RUN touch /var/log/maintenance.log

## Disable tls checks for wetty -> API
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

ADD init /init
RUN chmod +x /init

ADD liveness.sh /liveness.sh
RUN chmod +x /liveness.sh

ADD ingress-config /etc/nginx/ingress

RUN wget -q https://s3.amazonaws.com/cloud-pipeline-oss-builds/tools/filebeat/filebeat-6.8.3-x86_64.rpm \
    && rpm -vi filebeat-6.8.3-x86_64.rpm && rm -rf filebeat-6.8.3-x86_64.rpm

COPY filebeat-config/* /etc/filebeat/
RUN chmod go-w /etc/filebeat/*
