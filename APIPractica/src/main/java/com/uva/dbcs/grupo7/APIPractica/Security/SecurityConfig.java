package com.uva.dbcs.grupo7.APIPractica.Security;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig{
    private final UserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;
    public SecurityConfig(UserDetailsService userDetailsService, JwtAuthFilter jwtAuthFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
    }


    @Bean
    @Order(1)
    SecurityFilterChain filterChainDefault(HttpSecurity http, AuthenticationManager authManager){
        
            try {
                return http.regexMatcher("/users[?]email.*$")
                    .csrf().disable()
                    .authorizeRequests().anyRequest().permitAll()
                    .and()
                    .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .and()
                    .build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            return null;
    }

    @Bean
    @Order(2)
    SecurityFilterChain filterChainApi(HttpSecurity http, AuthenticationManager authManager){
            try {
                return http.cors().and()
                    .csrf().disable()
                    .authorizeRequests()
                    .anyRequest().authenticated()
                    .and()
                    .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .and()
                    .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                    .build();
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            return null;
    }

    

    @Bean
    AuthenticationManager authManager(HttpSecurity http) throws Exception{
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                    .userDetailsService(userDetailsService).passwordEncoder(passwordEncoder()).and().build();
    }





    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public FilterRegistrationBean<JwtAuthFilter> relatoriosFilter(){
        FilterRegistrationBean<JwtAuthFilter> registrationBean
                = new FilterRegistrationBean<>();

        registrationBean.setFilter(new JwtAuthFilter());
        registrationBean.addUrlPatterns("/users?email");

        return registrationBean;
    } 

    
}