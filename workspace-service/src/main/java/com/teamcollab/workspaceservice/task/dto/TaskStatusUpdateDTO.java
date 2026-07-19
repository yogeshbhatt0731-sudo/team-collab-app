package com.teamcollab.workspaceservice.task.dto;

import com.teamcollab.workspaceservice.task.entities.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TaskStatusUpdateDTO {
    private TaskStatus taskStatus;
}
