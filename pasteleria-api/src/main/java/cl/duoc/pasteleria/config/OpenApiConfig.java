package cl.duoc.pasteleria.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(
    title = "API de Pastelería Mil Sabores",
    version = "1.0",
    description = "Consulta y administración de productos, usuarios, pedidos y contactos",
    contact = @Contact(name = "Equipo Pastelería")
))
public class OpenApiConfig {
    @Bean
    GroupedOpenApi pasteleriaApi() {
        return GroupedOpenApi.builder()
            .group("v1")
            .pathsToMatch("/api/**")
            .build();
    }
}
