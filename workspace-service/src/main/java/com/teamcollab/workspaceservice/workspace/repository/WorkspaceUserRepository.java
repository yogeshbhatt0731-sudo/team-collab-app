package com.teamcollab.workspaceservice.workspace.repository;

import com.teamcollab.workspaceservice.workspace.entities.WorkspaceUser;
import com.teamcollab.workspaceservice.workspace.entities.WorkspaceUserId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspaceUserRepository extends JpaRepository<WorkspaceUser,WorkspaceUserId> {
}
