package com.uva.dbcs.grupo7.APIPractica.Security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
@Component
public class JwtAuthFilter extends OncePerRequestFilter{

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println(request.getRequestURI());
        if(request.getRequestURI().contains("/users?email")){
            filterChain.doFilter(request, response);
            return;
        }
        String tokenStr = request.getHeader("Authorization");
        if (tokenStr != null && tokenStr.startsWith("Bearer ")){
            String tokenJWT = tokenStr.substring(7);
            UsernamePasswordAuthenticationToken username = TokenUtil.getAuth(tokenJWT);
            SecurityContextHolder.getContext().setAuthentication(username);
        }
        filterChain.doFilter(request, response);
    }

   /*  @Override
    protected boolean shouldNotFilter(HttpServletRequest request)
    throws ServletException {
        String fullpath = request.getRequestURI() + "?" + request.getQueryString();
        System.out.println(fullpath.contains("/users?email"));
        return fullpath.contains("/users?email");
    } */
    


}
