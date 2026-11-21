package com.projectpos.shared.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI projectPosOpenAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("POS Platform API")
                        .description("""
                                REST API for a commercial supervision platform.

                                The current version exposes the core business modules:
                                - Products
                                - Categories
                                - Users
                                - Sales
                                - Dashboard

                                This API is designed to support the future React frontend
                                and the long-term evolution towards a SaaS multi-store platform.
                                """)
                        .version("v1")
                        .contact(new Contact()
                                .name("Mamadou Lamine Diallo")
                                .email("dlamine.k@gmail.com")
                                .url("https://github.com/mamadoulamine-diallo"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}