package com.teamcollab.auth_service.service;

import com.teamcollab.auth_service.dto.*;

import java.util.List;

public interface AuthService {

    ApiResponse register(RegisterRequestDTO registerRequestDTO);

    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);

    List<UserDetailsDTO> getUsersById(List<Long> ids);
}
