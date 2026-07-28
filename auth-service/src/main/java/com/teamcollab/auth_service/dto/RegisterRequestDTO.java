package com.teamcollab.auth_service.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RegisterRequestDTO {

   @NotBlank(message = "name is required")
   private String name;
   @NotBlank(message = "email is required")
   private String email;
   @NotBlank(message = "username is required")
   private String userName;
   @NotBlank(message = "password is required")
   private String password;
}
