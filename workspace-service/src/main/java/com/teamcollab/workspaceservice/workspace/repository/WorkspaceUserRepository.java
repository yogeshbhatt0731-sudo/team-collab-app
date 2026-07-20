package com.teamcollab.workspaceservice.workspace.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamcollab.workspaceservice.workspace.entities.WorkspaceUser;
import com.teamcollab.workspaceservice.workspace.entities.WorkspaceUserId;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface WorkspaceUserRepository extends JpaRepository<WorkspaceUser, WorkspaceUserId> {

    WorkspaceUser findWorkspaceUserByWorkspaceUserId(WorkspaceUserId workspaceUserId);

    @Modifying
    @Query("DELETE FROM WorkspaceUser wu WHERE wu.workspaceUserId.workspaceId = :w_id")
    void deleteAllByWorkspaceId(@Param("w_id") Long workspaceId);

}
