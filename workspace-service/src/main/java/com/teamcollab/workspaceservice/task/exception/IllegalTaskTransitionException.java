package com.teamcollab.workspaceservice.task.exception;

public class IllegalTaskTransitionException extends RuntimeException{
    public IllegalTaskTransitionException(String errMsg) {
        super(errMsg);
    }
}
