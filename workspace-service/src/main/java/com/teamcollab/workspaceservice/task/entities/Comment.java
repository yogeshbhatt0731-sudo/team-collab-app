package com.teamcollab.workspaceservice.task.entities;

import com.teamcollab.workspaceservice.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "comment")
@AttributeOverride(name = "id",column = @Column(name = "comment_id"))
@AttributeOverride(name = "createdAt",column = @Column(name = "created_at"))
public class Comment extends BaseEntity {
    // User 1 ---> * Comment , cross microservice association
    @Column(name = "user_id", nullable = false, updatable = false)
    private Long userId;

    // Task 1 --> * Comment
    @ManyToOne
    @JoinColumn(name = "task_id",nullable = false)
    private Task myTask;

    @Column(nullable = false,columnDefinition = "TEXT")
    private String content;

}
