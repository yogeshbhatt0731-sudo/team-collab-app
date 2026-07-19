package com.teamcollab.workspaceservice.task.dto;

import java.time.LocalDateTime;

import com.teamcollab.workspaceservice.task.entities.TaskPriority;
import com.teamcollab.workspaceservice.task.entities.TaskType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TaskRequestDTO {
	private String title ;
	private String description;
	private TaskPriority taskPriority;
	private TaskType taskType;
	private LocalDateTime dueDate;
	private Long projectID;
}
