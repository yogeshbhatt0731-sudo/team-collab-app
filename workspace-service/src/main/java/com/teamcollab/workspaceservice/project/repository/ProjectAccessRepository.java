package com.teamcollab.workspaceservice.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamcollab.workspaceservice.project.entities.ProjectAccess;
import com.teamcollab.workspaceservice.project.entities.WorkSpaceProjectUserId;

public interface ProjectAccessRepository extends JpaRepository<ProjectAccess, WorkSpaceProjectUserId> {
}
