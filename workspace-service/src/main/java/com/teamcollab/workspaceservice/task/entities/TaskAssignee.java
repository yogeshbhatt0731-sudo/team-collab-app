package com.teamcollab.workspaceservice.task.entities;

import com.teamcollab.workspaceservice.common.entity.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "task_assignee")
@AttributeOverride(name = "createdAt",column = @Column(name = "assigned_at"))
public class TaskAssignee extends Auditable {
    //injecting composite primary key as value type
    @EmbeddedId
    private TaskUserId taskUserId;


}
