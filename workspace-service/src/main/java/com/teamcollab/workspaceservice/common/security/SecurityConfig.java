package com.teamcollab.workspaceservice.common.security;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserContextFilter userContextFilter;

    /**
     * UserContextFilter is a @Component, so Spring Boot would otherwise also
     * register it as a plain servlet filter outside the security chain,
     * running it a second time per request. Disable that auto-registration
     * since it's wired explicitly below via addFilterBefore.
     */
    @Bean
    public FilterRegistrationBean<UserContextFilter> disableAutoRegistration() {
        FilterRegistrationBean<UserContextFilter> registrationBean = new FilterRegistrationBean<>(userContextFilter);
        registrationBean.setEnabled(false);
        return registrationBean;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/v3/api-docs.yaml", "/webjars/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/workspaces/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/projects/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/workspaces").authenticated()
                        .requestMatchers(HttpMethod.GET, "/task/**").authenticated()
                        .requestMatchers("/task/**").hasAnyRole("OWNER", "MEMBER")
                        .requestMatchers(HttpMethod.GET, "/feature/**").authenticated()
                        .requestMatchers("/feature/**").hasAnyRole("OWNER", "MEMBER")
                        .requestMatchers(HttpMethod.POST, "/workspaces/*/projects").hasRole("OWNER")
                        .requestMatchers(HttpMethod.PUT, "/projects/*").hasRole("OWNER")
                        .requestMatchers(HttpMethod.DELETE, "/projects/*").hasRole("OWNER")
                        .requestMatchers(HttpMethod.POST, "/sprints").hasRole("OWNER")
                        .requestMatchers(HttpMethod.PATCH, "/sprints/*/status").hasRole("OWNER")
                        .requestMatchers(HttpMethod.PATCH, "/sprints/*").hasRole("OWNER")
                        .requestMatchers(HttpMethod.DELETE, "/sprints/*").hasRole("OWNER")
                        .anyRequest().hasAnyRole("OWNER", "MEMBER")
                )
                .addFilterBefore(userContextFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
