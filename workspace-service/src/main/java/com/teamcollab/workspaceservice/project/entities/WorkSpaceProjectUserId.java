package com.teamcollab.workspaceservice.project.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class WorkSpaceProjectUserId implements Serializable {
    private Long workspaceId;
    private Long userId;
    private Long projectId;
}
