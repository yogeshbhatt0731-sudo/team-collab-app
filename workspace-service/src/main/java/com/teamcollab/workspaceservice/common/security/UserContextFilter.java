package com.teamcollab.workspaceservice.common.security;

import com.teamcollab.workspaceservice.workspace.entities.WorkspaceUser;
import com.teamcollab.workspaceservice.workspace.entities.WorkspaceUserId;
import com.teamcollab.workspaceservice.workspace.repository.WorkspaceUserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserContextFilter extends OncePerRequestFilter {
    private final UserContext userContext;
    private final JwtValidator jwtValidator;
    private final WorkspaceUserRepository workspaceUserRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring("Bearer ".length());

            Long userId;
            try {
                Claims claims = jwtValidator.parseAndValidate(token);
                userId = claims.get("user_id", Long.class);
                if (userId == null) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token missing user_id claim");
                    return;
                }
                userContext.setUserId(userId);
            } catch (JwtException | IllegalArgumentException exception) {
                log.debug("Rejected invalid JWT: {}", exception.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }

            List<GrantedAuthority> authorities = new ArrayList<>();
            String workspaceIdHeader = request.getHeader("X-Workspace-Id");
            log.info("UserContextFilter: userId={}, X-Workspace-Id header={}", userId, workspaceIdHeader);
            if (workspaceIdHeader != null) {
                try {
                    Long workspaceId = Long.valueOf(workspaceIdHeader);
                    WorkspaceUser workspaceUser = workspaceUserRepository
                            .findWorkspaceUserByWorkspaceUserId(new WorkspaceUserId(workspaceId, userId));
                    if (workspaceUser != null && workspaceUser.getRole() != null) {
                        log.info("UserContextFilter: resolved role={} for userId={} in workspaceId={}",
                                workspaceUser.getRole().name(), userId, workspaceId);
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + workspaceUser.getRole().name()));
                    } else {
                        log.warn("UserContextFilter: no WorkspaceUser found for userId={} in workspaceId={} (workspaceUser={})",
                                userId, workspaceId, workspaceUser);
                    }
                } catch (NumberFormatException exception) {
                    log.debug("Invalid X-Workspace-Id header: {}", workspaceIdHeader);
                }
            } else {
                log.warn("UserContextFilter: X-Workspace-Id header missing for userId={}, no authorities will be granted", userId);
            }
            log.info("UserContextFilter: final authorities for userId={} = {}", userId, authorities);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userId, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
