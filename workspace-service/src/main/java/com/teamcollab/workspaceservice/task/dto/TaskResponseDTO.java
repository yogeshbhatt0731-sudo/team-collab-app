package com.teamcollab.workspaceservice.task.dto;

import java.time.LocalDateTime;

import com.teamcollab.workspaceservice.task.entities.TaskPriority;
import com.teamcollab.workspaceservice.task.entities.TaskStatus;
import com.teamcollab.workspaceservice.task.entities.TaskType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TaskResponseDTO {
	private Long id;
	private String title ;
	private String description;
	private TaskPriority taskPriority;
	private TaskType taskType;
	private TaskStatus taskStatus;
	private LocalDateTime dueDate;
	private LocalDateTime createdAt;
}
