package com.teamcollab.workspaceservice.project.repository;

import com.teamcollab.workspaceservice.project.entities.ProjectAccess;
import com.teamcollab.workspaceservice.project.entities.WorkSpaceProjectUserId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectAccessRepository extends JpaRepository<ProjectAccess,WorkSpaceProjectUserId> {
}
