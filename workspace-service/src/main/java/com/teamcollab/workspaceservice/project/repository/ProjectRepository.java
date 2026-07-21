package com.teamcollab.workspaceservice.project.repository;

import com.teamcollab.workspaceservice.workspace.entities.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import com.teamcollab.workspaceservice.project.entities.Project;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByMyWorkspace(Workspace workspace);

    @Override
    Optional<Project> findById(Long projectId);
    List<Project> findAllByMyWorkspaceId(Long workspaceId);


}
