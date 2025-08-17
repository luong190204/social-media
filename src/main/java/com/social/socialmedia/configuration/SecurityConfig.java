package com.social.socialmedia.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity

public class SecurityConfig {

    private final String[] PUBLIC_ENDPOINT = {"/api/auth/register", "/api/auth/login", "/api/auth/logout", "/api/auth/introspect"
            , "/api/auth/refresh", "/api/posts"};

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.authorizeHttpRequests(request ->
                    request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINT).permitAll()
                            .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINT).permitAll()
                            .anyRequest().authenticated()); //Còn lại all request phải xác thực

        // Config: cần phải có bearer token mới get được những api không public
        http.oauth2ResourceServer(oauth2 ->
                    oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(customJwtDecoder)
                                    .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                            .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
                );

        http.csrf(AbstractHttpConfigurer::disable);

        return http.build();
    }

    // custom cách Spring Security lấy và xử lý quyền (authorities) từ JWT
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

        //set prefix rỗng ("") => giữ nguyên quyền như trong JWT
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

}