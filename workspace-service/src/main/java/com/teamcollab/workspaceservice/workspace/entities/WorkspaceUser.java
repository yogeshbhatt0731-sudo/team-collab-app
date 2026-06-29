package com.teamcollab.workspaceservice.workspace.entities;

import com.teamcollab.workspaceservice.common.entity.Auditable;
import jakarta.persistence.*;
import lombok.*;



@Entity
@Getter
@Setter
@Table(name = "workspace_user")
public class WorkspaceUser extends Auditable {
    @EmbeddedId
    private WorkspaceUserId workspaceUserId;

    @Enumerated(EnumType.STRING)
    private Role role;
}
