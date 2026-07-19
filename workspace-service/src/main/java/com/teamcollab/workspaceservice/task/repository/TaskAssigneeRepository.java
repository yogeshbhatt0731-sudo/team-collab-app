package com.teamcollab.workspaceservice.task.repository;

import com.teamcollab.workspaceservice.task.dto.TaskAssigneeResponseDTO;
import com.teamcollab.workspaceservice.task.entities.TaskAssignee;
import com.teamcollab.workspaceservice.task.entities.TaskUserId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskAssigneeRepository extends JpaRepository<TaskAssignee,TaskUserId> {
    @Query("select new com.teamcollab.workspaceservice.task.dto.TaskAssigneeResponseDTO(ta.taskUserId.userId,ta.createdAt)"+
            "from TaskAssignee ta where ta.taskUserId.taskId=:id")
    public List<TaskAssigneeResponseDTO> findAllAssignee(@Param("id") Long id);

    @Modifying
    @Query("delete from TaskAssignee ta where ta.taskUserId.userId=:uid and ta.taskUserId.taskId=:tid")
    public int deleteAssignee(@Param("uid") Long uid, @Param("tid") Long tid);

    @Query("select ta from TaskAssignee ta where ta.taskUserId.userId=:uid and ta.taskUserId.taskId=:tid")
    public TaskAssignee getAssignee(@Param("uid") Long uid, @Param("tid") Long tid);
}
