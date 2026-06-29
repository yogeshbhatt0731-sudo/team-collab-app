package com.teamcollab.workspaceservice.workspace.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

// the composite key as a value object
@Embeddable
@Getter @Setter @NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class WorkspaceUserId implements Serializable {
    private Long workspaceId;
    private Long userId;
}
