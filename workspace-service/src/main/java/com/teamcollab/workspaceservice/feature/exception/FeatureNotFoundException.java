package com.teamcollab.workspaceservice.feature.exception;

import com.teamcollab.workspaceservice.common.exception.NotFoundException;

public class FeatureNotFoundException extends NotFoundException {
    public FeatureNotFoundException(String message) {
        super(message);
    }
}
