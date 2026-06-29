package com.teamcollab.workspaceservice.task.entities;

import com.teamcollab.workspaceservice.common.entity.BaseEntity;
import com.teamcollab.workspaceservice.feature.entities.Feature;
import com.teamcollab.workspaceservice.project.entities.Project;
import com.teamcollab.workspaceservice.sprint.entities.Sprint;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "task")
@AttributeOverride(name = "id",column = @Column(name = "task_id"))
@AttributeOverride(name = "createdAt",column = @Column(name = "created_at"))
public class Task extends BaseEntity {
    // User 1 ---> * Task , cross microservice association
    @Column(name = "created_by", nullable = false, updatable = false)
    private Long createdBy;

    // Project 1 --> * Task
    @ManyToOne
    @JoinColumn(name = "project_id",nullable = false)
    private Project myProject;

    //Feature 1 --> * Task
    @ManyToOne
    @JoinColumn(name = "feature_id")
    private Feature myFeature;

    // Sprint 1 --> * Task
    @ManyToOne
    @JoinColumn(name = "sprint_id")
    private Sprint mySprint;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false,columnDefinition = "TEXT")
    private String description;

    @Column(name = "priority",nullable = false)
    @Enumerated(EnumType.STRING)
    private TaskPriority taskPriority;

    @Column(name = "status",nullable = false)
    @Enumerated(EnumType.STRING)
    private TaskStatus taskStatus;

    @Column(name = "type",nullable = false)
    @Enumerated(EnumType.STRING)
    private TaskType taskType;

    @Column(name = "due_date")
    private LocalDateTime dueDate;


}
