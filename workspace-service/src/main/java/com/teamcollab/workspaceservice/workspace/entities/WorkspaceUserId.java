package com.teamcollab.workspaceservice.workspace.entities;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.*;

// the composite key as a value object
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class WorkspaceUserId implements Serializable {
	private Long workspaceId;
	private Long userId;
}
