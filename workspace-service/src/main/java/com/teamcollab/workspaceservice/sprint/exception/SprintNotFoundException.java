package com.teamcollab.workspaceservice.sprint.exception;

import com.teamcollab.workspaceservice.common.exception.NotFoundException;

public class SprintNotFoundException extends NotFoundException {
    public SprintNotFoundException(String message) {
        super(message);
    }
}
