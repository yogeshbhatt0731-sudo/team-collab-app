package com.teamcollab.workspaceservice.workspace.repository;

import com.teamcollab.workspaceservice.workspace.dtos.WorkspaceDetailRespDto;
import org.springframework.data.jpa.repository.JpaRepository;

import com.teamcollab.workspaceservice.workspace.entities.Workspace;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

    boolean existsById(Long id);

    @Override
    Optional<Workspace> findById(Long aLong);

    List<Workspace> findByCreatedBy(Long userId);

    // SELECT w.*, wu.role
    //    -> FROM workspace w
    //    -> INNER JOIN workspace_user wu
    //    ->     ON w.workspace_id = wu.workspace_id
    //    -> WHERE wu.user_id = 1;
    @Query("""
    SELECT new com.teamcollab.workspaceservice.workspace.dtos.WorkspaceDetailRespDto(
        wu.workspaceUserId.userId,
        w.id,
        w.createdAt,
        w.updatedAt,
        w.name,
        wu.role
    )
    FROM Workspace w
    JOIN WorkspaceUser wu
        ON wu.workspaceUserId.workspaceId = w.id
    WHERE wu.workspaceUserId.userId = :userId
    """)
    List<WorkspaceDetailRespDto> findAllWorkspace(@Param("userId") Long userId);

}
