package com.teamcollab.workspaceservice.feature.entities;

import com.teamcollab.workspaceservice.common.entity.BaseEntity;
import com.teamcollab.workspaceservice.project.entities.Project;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "feature")
@AttributeOverride(name = "id",column = @Column(name = "feature_id"))
@AttributeOverride(name = "createdAt",column = @Column(name = "created_at"))
public class Feature extends BaseEntity {
    // User 1 ---> * Workspace , cross microservice association
    @Column(name = "created_by", nullable = false, updatable = false)
    private Long createdBy;

    @Column(nullable = false)
    private String name;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "status",nullable = false)
    @Enumerated(EnumType.STRING)
    private FeatureStatus featureStatus;

    // Feature 1 --> * Project
    @ManyToOne
    @JoinColumn(name = "project_id",nullable = false)
    private Project myProject;


}
