package com.teamcollab.workspaceservice.project.entities;

import com.teamcollab.workspaceservice.common.entity.BaseEntity;
import com.teamcollab.workspaceservice.workspace.entities.Workspace;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "project")
@AttributeOverride(name = "id",column = @Column(name = "project_id"))
@AttributeOverride(name = "createdAt",column = @Column(name = "created_at"))
public class Project extends BaseEntity {
    // User 1 ---> * Workspace , cross microservice association
    @Column(name = "created_by", nullable = false, updatable = false)
    private Long createdBy;

    // Workspace 1 --> * Projects , cross module association
    @ManyToOne
    @JoinColumn(name = "workspace_id",nullable = false)
    private Workspace myWorkspace;

    @Column(nullable = false)
    private String name;

}
