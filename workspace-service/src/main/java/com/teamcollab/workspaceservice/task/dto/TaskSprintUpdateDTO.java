package com.teamcollab.workspaceservice.task.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Request DTO for moving a task into a sprint (or back to the backlog).
// sprintId == null detaches the task from its sprint (backlog); a non-null id
// attaches it to that sprint. Kept separate from TaskUpdateDTO for the same
// reason status/projectID are: the association moves through its own endpoint.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskSprintUpdateDTO {
	private Long sprintId;
}
