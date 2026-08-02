package com.teamcollab.auth_service.controller;


import com.teamcollab.auth_service.dto.ApiResponse;
import com.teamcollab.auth_service.dto.LoginRequestDTO;
import com.teamcollab.auth_service.dto.RegisterRequestDTO;
import com.teamcollab.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register( @Valid @RequestBody RegisterRequestDTO registerRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(registerRequestDTO));
    }

    @PostMapping("/login")
        public ResponseEntity<?> login( @Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok(authService.login(loginRequestDTO));
    }

    // Endpoint - GET /auth/users?ids=1,2
    @GetMapping("/users")
    public ResponseEntity<?> getUsersById(@RequestParam(name = "ids") List<Long> ids)
    {
        System.out.println(ids.size());
        if(ids.isEmpty())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("failure","No id passed in request "));

        return ResponseEntity.ok(authService.getUsersById(ids));
    }
}
