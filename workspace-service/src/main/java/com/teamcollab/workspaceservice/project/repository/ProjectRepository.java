package com.teamcollab.workspaceservice.project.repository;

import com.teamcollab.workspaceservice.project.dtos.ProjectSummaryDto;
import com.teamcollab.workspaceservice.workspace.entities.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.teamcollab.workspaceservice.project.entities.Project;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByMyWorkspace(Workspace workspace);

    @Override
    Optional<Project> findById(Long projectId);
    List<Project> findAllByMyWorkspaceId(Long workspaceId);

    @Query("""
            SELECT new com.teamcollab.workspaceservice.project.dtos.ProjectSummaryDto(
                p.id, p.name, p.myWorkspace.id, p.myWorkspace.name, p.createdAt
            )
            FROM Project p
            WHERE EXISTS (
                SELECT 1
                FROM ProjectAccess pa
                WHERE pa.workSpaceProjectUserId.projectId = p.id
                  AND pa.workSpaceProjectUserId.userId = :userId
            )
            OR EXISTS (
                SELECT 1
                FROM WorkspaceUser wu
                WHERE wu.workspaceUserId.workspaceId = p.myWorkspace.id
                  AND wu.workspaceUserId.userId = :userId
            )
            """)
    List<ProjectSummaryDto> findAllByUserId(@Param("userId") Long userId);

}
