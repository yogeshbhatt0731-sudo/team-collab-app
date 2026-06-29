package com.teamcollab.workspaceservice.task.repository;

import com.teamcollab.workspaceservice.task.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task,Long> {
}
