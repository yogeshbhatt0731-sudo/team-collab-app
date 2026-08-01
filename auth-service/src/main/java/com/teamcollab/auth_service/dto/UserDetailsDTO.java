package com.teamcollab.auth_service.dto;



import java.time.LocalDateTime;



public record UserDetailsDTO(Long userId, String name, String email,String userName ,LocalDateTime createdAt) {
}
