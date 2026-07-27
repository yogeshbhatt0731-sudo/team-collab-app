package com.teamcollab.workspaceservice.task.repository;

import com.teamcollab.workspaceservice.task.dto.TaskAssigneeResponseDTO;
import com.teamcollab.workspaceservice.task.dto.TaskResponseDTO;
import com.teamcollab.workspaceservice.task.entities.Task;
import com.teamcollab.workspaceservice.task.entities.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

	@Query("select new com.teamcollab.workspaceservice.task.dto.TaskResponseDTO(t.id,t.title,t.description,t.taskPriority,t.taskType,t.taskStatus,t.dueDate,t.createdAt,t.mySprint.id,t.myFeature.id)" +
			"from Task t where t.id=:id")
	public TaskResponseDTO findTaskById(@Param("id") Long id);

	@Query("select new com.teamcollab.workspaceservice.task.dto.TaskResponseDTO(t.id,t.title,t.description,t.taskPriority,t.taskType,t.taskStatus,t.dueDate,t.createdAt,t.mySprint.id,t.myFeature.id)" +
			"from Task t where t.myProject.id=:id ")
	public List<TaskResponseDTO> findTasksByProject(@Param("id") Long id);

	// "My Board": every task where the given user is an assignee, across ALL projects.
	// Join TaskAssignee -> Task on the task id, and LEFT JOIN the sprint so BACKLOG tasks
	// (no sprint) are still returned (s.id comes back null for them).
	@Query("select new com.teamcollab.workspaceservice.task.dto.TaskResponseDTO(t.id,t.title,t.description,t.taskPriority,t.taskType,t.taskStatus,t.dueDate,t.createdAt,s.id,t.myFeature.id) " +
			"from TaskAssignee ta join Task t on t.id=ta.taskUserId.taskId left join t.mySprint s " +
			"where ta.taskUserId.userId=:uid")
	public List<TaskResponseDTO> findTasksAssignedTo(@Param("uid") Long uid);

	// When a sprint is completed, its unfinished (non-DONE) tasks roll back to the backlog:
	// null out their sprint FK. DONE tasks stay with the sprint as its completed history.
	@Modifying
	@Query("update Task t set t.mySprint = null where t.mySprint.id = :sprintId and t.taskStatus <> :keepStatus")
	public int detachUnfinishedTasksFromSprint(@Param("sprintId") Long sprintId, @Param("keepStatus") TaskStatus keepStatus);


}
