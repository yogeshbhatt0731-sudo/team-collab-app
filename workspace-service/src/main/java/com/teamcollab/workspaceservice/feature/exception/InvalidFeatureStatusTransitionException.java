package com.teamcollab.workspaceservice.feature.exception;

public class InvalidFeatureStatusTransitionException extends RuntimeException {
    public InvalidFeatureStatusTransitionException(String message) {
        super(message);
    }
}
