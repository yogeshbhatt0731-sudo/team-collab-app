package com.teamcollab.workspaceservice.workspace.entities;

import com.teamcollab.workspaceservice.common.entity.BaseEntity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "workspace")
@Getter
@Setter
@ToString
@AttributeOverride(name = "id", column = @Column(name = "workspace_id"))
@AttributeOverride(name = "createdAt", column = @Column(name = "created_at"))
public class Workspace extends BaseEntity {
	@Column(nullable = false)
	private String name;

	// User 1 ---> * Workspace , cross module association
	@Column(name = "created_by", nullable = false, updatable = false)
	private Long createdBy;

}
