package com.teamcollab.workspaceservice.task.service;



import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.task.dto.*;

import java.util.List;

public interface TaskService {
	public ApiResponse  createTask(TaskRequestDTO taskRequestDTO);

	public  TaskResponseDTO getTask(Long taskId);


	public ApiResponse updateTaskById(Long taskId,TaskUpdateDTO taskUpdateDTO);

	public ApiResponse changeTaskStatusById(Long taskId, TaskStatusUpdateDTO taskStatusUpdateDTO);

	// Delete a task (and its assignee/comment rows). null sprintId/featureId on the
	// two methods below detaches the task (moves it to the backlog / clears the feature).
	public ApiResponse deleteTaskById(Long taskId);

	public ApiResponse updateTaskSprint(Long taskId, Long sprintId);

	public ApiResponse updateTaskFeature(Long taskId, Long featureId);

	public ApiResponse assignTask(Long taskId, Long assigneeId);

	public List<TaskAssigneeResponseDTO> getAssignees(Long taskId);

	public ApiResponse deleteAssignee(Long taskId, Long userId);

	public List<TaskResponseDTO> getTasksByProject(Long projectId);

	// "My Board" — tasks assigned to the current user (no param: identity comes from userContext).
	public List<TaskResponseDTO> getAssignedTasks();
}
