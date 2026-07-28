package com.teamcollab.auth_service.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ApiResponse {

    private String status;
    private LocalDateTime timestamp;
    private String message;

    public ApiResponse(String status,String message ) {
        this.status = status;
        this.message = message;
        timestamp = LocalDateTime.now();
    }
}
