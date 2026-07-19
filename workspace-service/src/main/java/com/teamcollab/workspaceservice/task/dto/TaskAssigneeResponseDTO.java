package com.teamcollab.workspaceservice.task.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class TaskAssigneeResponseDTO {
    private Long userId;
    private LocalDateTime assignedAt;
}
