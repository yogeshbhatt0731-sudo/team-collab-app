package com.teamcollab.workspaceservice.task.dto;

import java.time.LocalDateTime;

import com.teamcollab.workspaceservice.task.entities.TaskPriority;
import com.teamcollab.workspaceservice.task.entities.TaskType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Request DTO for editing a task's plain fields.
// Status is intentionally NOT here: it moves only through the guarded
// PATCH /task/{id}/status endpoint (the state machine). projectID is also
// absent (a task can't be re-assigned to another project via update).
@Getter
@Setter
@AllArgsConstructor
public class TaskUpdateDTO {
	private String title;
	private String description;
	private TaskPriority taskPriority;
	private TaskType taskType;
	private LocalDateTime dueDate;
}
