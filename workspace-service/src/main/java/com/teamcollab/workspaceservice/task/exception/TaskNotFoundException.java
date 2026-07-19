package com.teamcollab.workspaceservice.task.exception;

import com.teamcollab.workspaceservice.common.exception.NotFoundException;

public class TaskNotFoundException extends NotFoundException {
    public TaskNotFoundException(String message) {
        super(message);
    }
}
