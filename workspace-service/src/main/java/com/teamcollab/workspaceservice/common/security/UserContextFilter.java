package com.teamcollab.workspaceservice.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class UserContextFilter extends OncePerRequestFilter {
    private final UserContext userContext;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // TODO [AUTH]: THE JWT SEAM. Today we trust a raw X-User-Id header — any client can set it.
        //              Replace with: read the "Authorization: Bearer <jwt>" token, validate its
        //              signature + expiry, and set userContext from the verified subject/claims.
        //              Every "TODO [AUTH]" in the services assumes this is done. See backend-auth-todos.md.
        String id = request.getHeader("X-User-Id");
        if (id !=null)
        {
            userContext.setUserId(Long.parseLong(id));
        }
        filterChain.doFilter(request, response);
    }
}
