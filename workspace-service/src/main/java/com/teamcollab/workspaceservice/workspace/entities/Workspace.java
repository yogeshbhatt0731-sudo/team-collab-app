package com.teamcollab.workspaceservice.workspace.entities;

import com.teamcollab.workspaceservice.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "workspace")
@Getter
@Setter
@AttributeOverride(name = "id",column = @Column(name = "workspace_id"))
@AttributeOverride(name = "createdAt",column = @Column(name = "created_at"))
public class Workspace extends BaseEntity {
    @Column(nullable = false)
    private String name;

    // User 1 ---> * Workspace , cross module association
    @Column(name = "created_by", nullable = false, updatable = false)
    private Long createdBy;

}
