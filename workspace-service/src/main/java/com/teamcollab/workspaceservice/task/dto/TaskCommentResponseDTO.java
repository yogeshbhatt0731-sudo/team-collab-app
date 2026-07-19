package com.teamcollab.workspaceservice.task.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class TaskCommentResponseDTO {
    private Long commentId;
    private Long userId;
    private Long taskId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
