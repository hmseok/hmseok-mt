package com.example.carrepair.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/api/users/**").permitAll() // 임시로 모든 사용자 접근 허용
                .requestMatchers("/api/cars/**").permitAll() // 임시로 모든 차량 API 접근 허용
                .requestMatchers("/api/customers/**").permitAll() // 임시로 모든 고객 API 접근 허용
                .requestMatchers("/api/estimates/**").permitAll() // 임시로 모든 견적 API 접근 허용
                .requestMatchers("/api/repairs/**").permitAll() // 임시로 모든 수리 API 접근 허용
                .requestMatchers("/", "/index.html", "/static/**", "/css/**", "/js/**", "/images/**", "/*.js", "/*.css", "/*.ico", "/*.png", "/*.jpg", "/*.jpeg", "/*.gif", "/*.svg").permitAll() // 정적 파일 접근 허용
                .anyRequest().permitAll() // 개발 환경에서는 모든 요청 허용
            )
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "https://hmseok.com",
            "https://www.hmseok.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 