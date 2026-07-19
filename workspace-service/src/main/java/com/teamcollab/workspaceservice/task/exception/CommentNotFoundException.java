package com.teamcollab.workspaceservice.task.exception;

import com.teamcollab.workspaceservice.common.exception.NotFoundException;

public class CommentNotFoundException extends NotFoundException {
    public CommentNotFoundException(String message) {
        super(message);
    }
}
