package com.teamcollab.auth_service.service;

import com.teamcollab.auth_service.dto.*;
import com.teamcollab.auth_service.entity.User;
import com.teamcollab.auth_service.repository.UserRepository;
import com.teamcollab.auth_service.security.CustomUserDetails;
import com.teamcollab.auth_service.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Transactional
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;


    @Override
    public ApiResponse register(RegisterRequestDTO registerRequestDTO) {

        if(userRepository.existsByEmail(registerRequestDTO.getEmail()))
            throw new IllegalArgumentException("Email already in use");

        if(userRepository.existsByUserName(registerRequestDTO.getPassword()))
            throw new IllegalArgumentException("username already exists.");


        //or could have used model mapper.
        User user = new User();
        user.setName(registerRequestDTO.getName());
        user.setUserName(registerRequestDTO.getUserName());
        user.setEmail(registerRequestDTO.getEmail());
        user.setPasswordHashed(passwordEncoder.encode(registerRequestDTO.getPassword()));

        userRepository.save(user);
        return new ApiResponse("success","user registered successfully");

    }

    @Override
    public LoginResponseDTO login( LoginRequestDTO loginRequestDTO) {

        //spring security verifies credentials :loads user via CustomerUserDetailaService
        //then calls Bcrypt.matches(rawPassword , storedHash ) internally

         Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getUserName(), loginRequestDTO.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

        String token = jwtUtils.generateToken(userDetails);

        return new LoginResponseDTO(
                userDetails.getUserId(),
                userDetails.getName(),
                userDetails.getUsername(),
                token
        );
    }

    @Override
    public List<UserDetailsDTO> getUsersById(List<Long> ids) {
        return userRepository.findAllByUserIds(ids);
    }
}
