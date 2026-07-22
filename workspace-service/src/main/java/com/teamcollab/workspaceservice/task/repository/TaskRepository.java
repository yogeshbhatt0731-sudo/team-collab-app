package com.teamcollab.workspaceservice.task.repository;

import com.teamcollab.workspaceservice.task.dto.TaskAssigneeResponseDTO;
import com.teamcollab.workspaceservice.task.dto.TaskResponseDTO;
import com.teamcollab.workspaceservice.task.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {
	/*
	 * private String title ;
	private String description;
	private TaskPriority taskPriority;
	private TaskType taskType;
	private TaskStatus taskStatus;
	private LocalDateTime dueDate;
	private LocalDateTime createdAt;
	 */

	@Query("select new com.teamcollab.workspaceservice.task.dto.TaskResponseDTO(t.id,t.title,t.description,t.taskPriority,t.taskType,t.taskStatus,t.dueDate,t.createdAt,t.mySprint.id)" +
			"from Task t where t.id=:id")
	public TaskResponseDTO findTaskById(@Param("id") Long id);

	@Query("select new com.teamcollab.workspaceservice.task.dto.TaskResponseDTO(t.id,t.title,t.description,t.taskPriority,t.taskType,t.taskStatus,t.dueDate,t.createdAt,t.mySprint.id)" +
			"from Task t where t.myProject.id=:id ")
	public List<TaskResponseDTO> findTasksByProject(@Param("id") Long id);


}
