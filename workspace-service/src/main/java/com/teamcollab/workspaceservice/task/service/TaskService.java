package com.teamcollab.workspaceservice.task.service;



import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.task.dto.*;

import java.util.List;

public interface TaskService {
	public ApiResponse  createTask(TaskRequestDTO taskRequestDTO);

	public  TaskResponseDTO getTask(Long taskId);

	public List<TaskResponseDTO> getAllTasks();

	public ApiResponse updateTaskById(Long taskId,TaskUpdateDTO taskUpdateDTO);

	public ApiResponse changeTaskStatusById(Long taskId, TaskStatusUpdateDTO taskStatusUpdateDTO);

	public ApiResponse assignTask(Long taskId, Long assigneeId);

	public List<TaskAssigneeResponseDTO> getAssignees(Long taskId);

	public ApiResponse deleteAssignee(Long taskId, Long userId);
}
