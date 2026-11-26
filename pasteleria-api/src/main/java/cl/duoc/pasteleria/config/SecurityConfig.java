package cl.duoc.pasteleria.config;

import cl.duoc.pasteleria.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(rules -> rules
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/v1/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/productos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/pedidos/numero/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/pedidos/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/v1/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/pedidos/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/v1/productos/**", "/api/v1/pedidos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/productos/**", "/api/v1/pedidos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/usuarios/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/usuarios/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/v1/usuarios/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/v1/usuarios/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/carrito/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/v1/contactos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/contactos/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/v1/pedidos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/contactos/**", "/api/v1/pedidos/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
