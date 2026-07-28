package com.teamcollab.auth_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginRequestDTO {
     @NotBlank(message = "username is required")
    private String userName;
     @NotBlank(message = "password is required")
    private String password;

}
