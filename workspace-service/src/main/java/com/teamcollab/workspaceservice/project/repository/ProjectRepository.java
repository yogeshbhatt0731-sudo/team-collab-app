package com.teamcollab.workspaceservice.project.repository;

import com.teamcollab.workspaceservice.project.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project,Long> {
}
