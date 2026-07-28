package com.teamcollab.auth_service.service;

import com.teamcollab.auth_service.dto.ApiResponse;
import com.teamcollab.auth_service.dto.LoginRequestDTO;
import com.teamcollab.auth_service.dto.LoginResponseDTO;
import com.teamcollab.auth_service.dto.RegisterRequestDTO;

public interface AuthService {

    ApiResponse register(RegisterRequestDTO registerRequestDTO);

    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);
}
