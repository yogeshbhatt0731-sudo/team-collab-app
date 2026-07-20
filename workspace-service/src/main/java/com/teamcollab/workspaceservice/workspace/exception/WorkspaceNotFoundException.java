package com.teamcollab.workspaceservice.workspace.exception;

import com.teamcollab.workspaceservice.common.exception.NotFoundException;

public class WorkspaceNotFoundException extends NotFoundException {


    public WorkspaceNotFoundException(String message) {
        super(message);
    }
}
