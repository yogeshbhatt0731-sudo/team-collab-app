package com.teamcollab.auth_service.exception;


import com.teamcollab.auth_service.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler extends RuntimeException{

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgumentException (IllegalArgumentException ex)
    {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse("failure",ex.getMessage()));
    }

}
