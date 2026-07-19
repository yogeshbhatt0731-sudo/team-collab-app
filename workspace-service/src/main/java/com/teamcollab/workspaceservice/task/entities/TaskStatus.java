package com.teamcollab.workspaceservice.task.entities;

public enum TaskStatus {
    TODO, IN_PROGRESS, IN_REVIEW, DONE;

    public boolean canTransitionTo(TaskStatus target)
    {
        switch(this)
        {
            case TODO:
                return target == IN_PROGRESS;

            case IN_PROGRESS:
                return target == IN_REVIEW || target == TODO;

            case IN_REVIEW:
                return target == DONE || target == IN_PROGRESS;

            case DONE:
                return target == TODO;

            default:
                return false;

        }
    }
}
