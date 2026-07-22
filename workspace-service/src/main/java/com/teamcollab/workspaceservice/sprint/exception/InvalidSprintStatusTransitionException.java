package com.teamcollab.workspaceservice.sprint.exception;

public class InvalidSprintStatusTransitionException extends RuntimeException {

    public InvalidSprintStatusTransitionException(String message) {
        super(message);
    }

}
