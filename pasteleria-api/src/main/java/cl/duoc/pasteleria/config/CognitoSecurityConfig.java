package cl.duoc.pasteleria.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("cognito")
public class CognitoSecurityConfig {
    private static final String READ = "SCOPE_pasteleria-api/read";
    private static final String WRITE = "SCOPE_pasteleria-api/write";

    @Bean
    JwtDecoder jwtDecoder(@Value("${COGNITO_ISSUER}") String issuer,
                          @Value("${COGNITO_CLIENT_ID}") String clientId) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder
            .withJwkSetUri(issuer + "/.well-known/jwks.json").build();
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
            JwtValidators.createDefaultWithIssuer(issuer),
            new JwtClaimValidator<String>("client_id", clientId::equals),
            new JwtClaimValidator<String>("token_use", "access"::equals)
        ));
        return decoder;
    }

    @Bean
    SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {
        return http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(rules -> rules
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/**").hasAuthority(READ)
                .requestMatchers(HttpMethod.POST, "/api/**").hasAuthority(WRITE)
                .requestMatchers(HttpMethod.PUT, "/api/**").hasAuthority(WRITE)
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasAuthority(WRITE)
                .anyRequest().denyAll())
            .oauth2ResourceServer(resource -> resource.jwt(Customizer.withDefaults()))
            .build();
    }
}
