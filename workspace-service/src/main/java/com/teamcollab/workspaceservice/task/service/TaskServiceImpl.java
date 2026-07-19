package com.teamcollab.workspaceservice.task.service;

import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.common.security.UserContext;
import com.teamcollab.workspaceservice.project.service.ProjectService;
import com.teamcollab.workspaceservice.task.dto.*;
import com.teamcollab.workspaceservice.task.entities.*;
import com.teamcollab.workspaceservice.task.exception.*;
import com.teamcollab.workspaceservice.task.repository.TaskAssigneeRepository;
import com.teamcollab.workspaceservice.task.repository.TaskRepository;



import lombok.RequiredArgsConstructor;

import java.util.List;


import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService{
	private final UserContext userContext;
	private final TaskRepository taskRepository;
	private final TaskAssigneeRepository taskAssigneeRepository;
    private final ModelMapper mapper;
    private final ProjectService projectService;



	@Transactional
	public  ApiResponse createTask(TaskRequestDTO taskRequestDTO) {
		

		
		// Create new Task entity
		Task task = mapper.map(taskRequestDTO,Task.class);
		
		//todo - associate task with the project here , by making a cross module call to fetch project entity
		// Project project = projectService.getProject(id);
//		task.setMyProject(project);
		
		//Associating Task with user , here we got the authenticated and authorized  user via cross service call 
		task.setCreatedBy(userContext.getUserId());
		task.setTaskStatus(TaskStatus.TODO);
		
		Task createdTask = taskRepository.save(task);// saved entity 
		return new ApiResponse("success", "Task created successfully with task id "+ createdTask.getId());
	}



	@Override
	public TaskResponseDTO getTask(Long taskId) {

		TaskResponseDTO taskResponseDTO = taskRepository.findTaskById(taskId);
		if(taskResponseDTO==null)
			throw new TaskNotFoundException("Task with task id: "+taskId+" not found!");

		return taskResponseDTO;

	}

	@Override
	public List<TaskResponseDTO> getAllTasks() {
		return taskRepository.findAllTasks();
	}

	@Transactional
	@Override
	public ApiResponse updateTaskById(Long taskId,TaskUpdateDTO taskUpdateDTO) {
		// 1 . find the task with the given id
		Task task = taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task with "+taskId +" not found!!"));
		// task - persistent (managed) entity

		// Copy the editable fields from the DTO onto the managed entity.
		// MapperConfig uses Conditions.isNotNull(), so null fields in the request are skipped
		// (partial-update safe).
		mapper.map(taskUpdateDTO, task);

		// dirty checking flushes the changes at commit.
		return new ApiResponse("success","Task with "+taskId +" updated successfully !!");
	}

	@Transactional
	@Override
	public ApiResponse changeTaskStatusById(Long taskId, TaskStatusUpdateDTO taskStatusUpdateDTO) {
		// 1 . find the task with the given id
		Task task = taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task with "+taskId +" not found!!"));
		// task - persistent (managed) entity

		if(!task.getTaskStatus().canTransitionTo(taskStatusUpdateDTO.getTaskStatus()))
			throw new IllegalTaskTransitionException("Task state transition from "+task.getTaskStatus() + " to "+taskStatusUpdateDTO.getTaskStatus()+ " not allowed!! ");

		task.setTaskStatus(taskStatusUpdateDTO.getTaskStatus());
		return new ApiResponse("success","Task with taskId "+taskId+" task status updated successfully !!");
	}

	@Override
	@Transactional
	public ApiResponse assignTask(Long taskId, Long assigneeId) {
		if(!taskRepository.existsById(taskId))
			throw new TaskNotFoundException("Task with "+taskId+" not found!!!");

		if(taskAssigneeRepository.getAssignee(assigneeId,taskId)!=null)
			throw new DuplicateAssignmentException("Already assigned to "+assigneeId);
		TaskAssignee taskAssignee = new TaskAssignee();
		TaskUserId taskUserId = new TaskUserId();
		taskUserId.setTaskId(taskId);
		taskUserId.setUserId(assigneeId);
		taskAssignee.setTaskUserId(taskUserId);

		taskAssigneeRepository.save(taskAssignee);
		return new ApiResponse("success","Task with taskId "+taskId+" assigned successfully !!");
	}

	@Override
	public List<TaskAssigneeResponseDTO> getAssignees(Long taskId) {
		return taskAssigneeRepository.findAllAssignee(taskId);
	}

	@Transactional
	@Override
	public ApiResponse deleteAssignee(Long taskId, Long userId) {
		if(taskAssigneeRepository.getAssignee(userId,taskId)==null)
			throw new InvalidUnAssignmentException("Trying to unassign something that is not assigned to "+userId);
		return new ApiResponse("success","No of rows affected "+taskAssigneeRepository.deleteAssignee(userId,taskId));
	}


}
