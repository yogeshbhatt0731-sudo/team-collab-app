package com.teamcollab.workspaceservice.task.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TaskUserId implements Serializable {
    //injecting composite primary key as value type
    private Long taskId;
    private Long userId;
}
