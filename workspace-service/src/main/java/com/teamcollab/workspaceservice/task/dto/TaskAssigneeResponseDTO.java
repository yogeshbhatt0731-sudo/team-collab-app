package com.teamcollab.workspaceservice.task.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskAssigneeResponseDTO {
    private Long userId;
    private LocalDateTime assignedAt;
    private String name;
    private String email;

    public TaskAssigneeResponseDTO(Long userId, LocalDateTime assignedAt) {
        this.userId = userId;
        this.assignedAt = assignedAt;
    }
}
