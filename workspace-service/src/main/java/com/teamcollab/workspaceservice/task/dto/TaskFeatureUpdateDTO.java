package com.teamcollab.workspaceservice.task.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Request DTO for attaching a task to a feature (or detaching it).
// featureId == null detaches the task from its feature; a non-null id attaches
// it to that feature. Separate endpoint/DTO, mirroring TaskSprintUpdateDTO.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskFeatureUpdateDTO {
	private Long featureId;
}
