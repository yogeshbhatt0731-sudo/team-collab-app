package com.teamcollab.workspaceservice.task.repository;

import com.teamcollab.workspaceservice.task.entities.TaskAssignee;
import com.teamcollab.workspaceservice.task.entities.TaskUserId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskAssigneeRepository extends JpaRepository<TaskAssignee,TaskUserId> {
}
