package com.teamcollab.workspaceservice.workspace.repository;

import com.teamcollab.workspaceservice.workspace.entities.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspaceRepository extends JpaRepository<Workspace,Long> {
}
