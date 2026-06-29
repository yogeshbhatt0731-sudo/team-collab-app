package com.teamcollab.workspaceservice.project.exception;

import com.teamcollab.workspaceservice.common.exception.NotFoundException;

public class ProjectNotFoundException extends NotFoundException {
    public ProjectNotFoundException(String message) {
        super(message);
    }
}
