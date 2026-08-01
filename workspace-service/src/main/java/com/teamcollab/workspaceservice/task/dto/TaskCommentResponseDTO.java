package com.teamcollab.workspaceservice.task.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskCommentResponseDTO {
    private Long commentId;
    private Long userId;
    private Long taskId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String authorName;

    public TaskCommentResponseDTO(Long commentId, Long userId, Long taskId, String content, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.commentId = commentId;
        this.userId = userId;
        this.taskId = taskId;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
