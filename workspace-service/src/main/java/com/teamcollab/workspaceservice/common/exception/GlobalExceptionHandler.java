package com.teamcollab.workspaceservice.common.exception;

import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.sprint.exception.InvalidSprintStatusTransitionException;
import com.teamcollab.workspaceservice.sprint.exception.InvalidSprintUpdationException;
import com.teamcollab.workspaceservice.task.exception.*;
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler extends RuntimeException {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> handleNotFoundException(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Failure",ex.getMessage()));
    }

    @ExceptionHandler(InvalidSprintStatusTransitionException.class)
    public ResponseEntity<?> handleIllegalSprintTranstitionException(InvalidSprintStatusTransitionException ex)
    {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(new ApiResponse("Failure",ex.getMessage()));
    }

    @ExceptionHandler(InvalidSprintUpdationException.class)
    public ResponseEntity<?> handleIllegalSprintUpdationException(InvalidSprintUpdationException ex)
    {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(new ApiResponse("Failure",ex.getMessage()));
    }

    @ExceptionHandler(IllegalTaskTransitionException.class)
    public ResponseEntity<?> handleIllegalTaskTranstitionException(IllegalTaskTransitionException ex)
    {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(new ApiResponse("Failure",ex.getMessage()));
    }

    @ExceptionHandler(DuplicateAssignmentException.class)
    public ResponseEntity<?> handleDuplicateAssignmentException(DuplicateAssignmentException ex)
    {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse("Failure",ex.getMessage()));
    }

    @ExceptionHandler(InvalidUnAssignmentException.class)
    public ResponseEntity<?> handleInvalidUnAssignmentException(InvalidUnAssignmentException ex)
    {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Failure",ex.getMessage()));
    }

    @ExceptionHandler(CommentNotFoundException.class)
    public ResponseEntity<?> handleCommentNotFoundException(CommentNotFoundException ex)
        {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Failure",ex.getMessage()));
        }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<?> handleForbiddenException(ForbiddenException ex)
    {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse("Failure",ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse("Failure", ex.getMessage()));
    }

    @ExceptionHandler(FeignException.NotFound.class)
    public ResponseEntity<?> handleFeignNotFoundException(FeignException.NotFound ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Failure", "User not registered yet"));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleInvalidInputException(RuntimeException e)
    {
    	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("error",e.getMessage()));
    }


}
