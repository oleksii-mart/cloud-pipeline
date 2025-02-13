/*
 * Copyright 2017-2023 EPAM Systems, Inc. (https://www.epam.com/)
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

package com.epam.pipeline.app;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import com.epam.pipeline.config.JsonMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Configuration
public class AppMVCConfiguration extends WebMvcConfigurerAdapter {

    private static final String[] CACHED_RESOURCES_PATH =
        {"/iconfont/**", "/static/css/*.css", "/static/js/*.js"};
    private static final String[] CACHED_RESOURCES_LOCATION =
        {"classpath:static/iconfont/", "classpath:static/static/css/", "classpath:static/static/js/"};

    //default value is 30 days
    @Value("${static.resources.cache.sec.period:2592000}")
    private long staticResourcesCachePeriod;

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        MappingJackson2HttpMessageConverter converter =
                new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper());
        converters.add(converter);
        super.configureMessageConverters(converters);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
                .addResourceHandler(CACHED_RESOURCES_PATH)
                .addResourceLocations(CACHED_RESOURCES_LOCATION)
                .setCacheControl(CacheControl.maxAge(staticResourcesCachePeriod, TimeUnit.SECONDS)
                        .cachePublic()
                        .mustRevalidate())
                .resourceChain(true);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedMethods("GET", "PUT", "DELETE", "POST");
    }

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        super.configurePathMatch(configurer);
        configurer.setUseSuffixPatternMatch(false);
    }


    @Bean
    public ServletRegistrationBean dispatcherRegistration(){
        DispatcherServlet dispatcherServlet = new DispatcherServlet();
        ServletRegistrationBean bean =
                new ServletRegistrationBean(dispatcherServlet, "/restapi/*");
        bean.setAsyncSupported(true);
        bean.setName("pipeline");
        bean.setLoadOnStartup(1);
        AnnotationConfigWebApplicationContext applicationContext = new AnnotationConfigWebApplicationContext();
        applicationContext.register(RestConfiguration.class);
        dispatcherServlet.setApplicationContext(applicationContext);
        return bean;
    }

    @Bean
    public JsonMapper objectMapper() {
        return new JsonMapper();
    }

    @WebFilter(urlPatterns = {"/restapi/*"})
    @Component
    @ConditionalOnProperty(name = "server.override.host.header")
    public static class HeaderFilter extends OncePerRequestFilter {

        @Value("${kube.current.pod.name}")
        private String kubePodName;

        @Value("${server.pod.header.name:Pod-Name}")
        private String headerName;

        @Override
        protected void doFilterInternal(final HttpServletRequest request,
                                        final HttpServletResponse response,
                                        final FilterChain filterChain) throws ServletException, IOException {
            response.setHeader(headerName, kubePodName);
            filterChain.doFilter(request, response);
        }
    }
}
