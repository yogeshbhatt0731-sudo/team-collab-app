package com.teamcollab.workspaceservice.workspace.entities;

import com.teamcollab.workspaceservice.common.entity.Auditable;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "workspace_user")
public class WorkspaceUser extends Auditable {
	@EmbeddedId
	private WorkspaceUserId workspaceUserId;

	@Enumerated(EnumType.STRING)
	private Role role;
}
