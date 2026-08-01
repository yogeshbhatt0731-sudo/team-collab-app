package com.teamcollab.workspaceservice.common.dtos;

/*
 private Long userId;
    private String name;
    private String email;
    private String userName;
    private LocalDateTime createdAt;
 */

import java.time.LocalDateTime;

public record UserDetailsDTO(Long userId, String name, String email,String userName ,LocalDateTime createdAt) {
}
