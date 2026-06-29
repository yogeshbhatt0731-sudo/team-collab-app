package com.teamcollab.workspaceservice.project.entities;

import com.teamcollab.workspaceservice.common.entity.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "project_access")
@AttributeOverride(name = "createdAt",column = @Column(name = "granted_at"))
public class ProjectAccess extends Auditable {
    //injecting composite primary key as value type
    @EmbeddedId
    private WorkSpaceProjectUserId workSpaceProjectUserId;


}
