package com.teamcollab.workspaceservice.task.service;

import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.common.dtos.UserDetailsDTO;
import com.teamcollab.workspaceservice.common.feign.AuthServiceClient;
import com.teamcollab.workspaceservice.common.security.UserContext;
import com.teamcollab.workspaceservice.feature.service.FeatureService;
import com.teamcollab.workspaceservice.project.entities.Project;
import com.teamcollab.workspaceservice.project.service.ProjectService;
import com.teamcollab.workspaceservice.sprint.service.SprintService;
import com.teamcollab.workspaceservice.task.dto.*;
import com.teamcollab.workspaceservice.task.entities.*;
import com.teamcollab.workspaceservice.task.exception.*;
import com.teamcollab.workspaceservice.task.repository.CommentRepository;
import com.teamcollab.workspaceservice.task.repository.TaskAssigneeRepository;
import com.teamcollab.workspaceservice.task.repository.TaskRepository;



import lombok.RequiredArgsConstructor;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


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
	private final CommentRepository commentRepository;
    private final ModelMapper mapper;
    private final ProjectService projectService;
    private final SprintService sprintService;
    private final FeatureService featureService;
	private final AuthServiceClient authServiceClient;



	@Transactional
	public  ApiResponse createTask(TaskRequestDTO taskRequestDTO) {
		

		
		// Create new Task entity
		Task task = mapper.map(taskRequestDTO,Task.class);
		
		//associate task with the project here , by making a cross module call to fetch project entity
		Project project = projectService.getProject(userContext.getUserId(),taskRequestDTO.getProjectID());
		task.setMyProject(project);
		

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
	public List<TaskResponseDTO> getTasksByProject(Long projectId) {
		return taskRepository.findTasksByProject(projectId);
	}

	@Override
	public List<TaskResponseDTO> getAssignedTasks() {
		// "My Board": every task, across all projects, where the CURRENT user is an assignee.
		// The user id comes from userContext (X-User-Id stub now, JWT later) — never from a
		// request param, so a caller can only ever pull their OWN assigned tasks.
		return taskRepository.findTasksAssignedTo(userContext.getUserId());
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

	@Transactional
	@Override
	public ApiResponse deleteTaskById(Long taskId) {

		Task task = taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task with "+taskId +" not found!!"));

		// Clear the child rows first — task_assignee references the task in its composite key and
		// comment.task_id is NOT NULL, so either would block the delete with an FK violation.
		taskAssigneeRepository.deleteByTask(taskId);
		commentRepository.deleteByTask(taskId);

		taskRepository.delete(task);
		return new ApiResponse("success","Task with taskId "+taskId+" deleted successfully !!");
	}

	@Transactional
	@Override
	public ApiResponse updateTaskSprint(Long taskId, Long sprintId) {

		Task task = taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task with "+taskId +" not found!!"));

		// null -> pull the task back to the backlog; otherwise attach it to an existing sprint
		// (assertExists 404s on a bad id). Dirty checking flushes the change at commit.
		if(sprintId == null) {
			task.setMySprint(null);
			return new ApiResponse("success","Task with taskId "+taskId+" moved to backlog !!");
		}
		task.setMySprint(sprintService.assertExists(sprintId));
		return new ApiResponse("success","Task with taskId "+taskId+" added to sprint "+sprintId+" !!");
	}

	@Transactional
	@Override
	public ApiResponse updateTaskFeature(Long taskId, Long featureId) {

		Task task = taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task with "+taskId +" not found!!"));

		// null -> detach from its feature; otherwise attach it to an existing feature
		// (assertExists 404s on a bad id). Dirty checking flushes the change at commit.
		if(featureId == null) {
			task.setMyFeature(null);
			return new ApiResponse("success","Task with taskId "+taskId+" detached from its feature !!");
		}
		task.setMyFeature(featureService.assertExists(featureId));
		return new ApiResponse("success","Task with taskId "+taskId+" added to feature "+featureId+" !!");
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
		List<TaskAssigneeResponseDTO> assginees =  taskAssigneeRepository.findAllAssignee(taskId);
		if(assginees.isEmpty())
			return assginees;

		//Collect all userIds from the assignees
		List<Long> userIds = assginees.stream()
				.map(u -> u.getUserId())
				.toList();

		// inter service call to auth-service for user details of these id list
		List<UserDetailsDTO> userDetails = authServiceClient.getUsersById(userIds);

		// adding those details to assignees
        Map<Long,UserDetailsDTO> userDetailsMap = userDetails.stream()
				.collect(Collectors.toMap(
						u -> u.userId(),
						u -> u
				));
		assginees.forEach(
				a -> {
					UserDetailsDTO userDetail = userDetailsMap.get(a.getUserId());
					if(userDetail!=null)
					{
						a.setName(userDetail.name());
						a.setEmail(userDetail.email());
					}
				}
		);

		return assginees;
	}

	@Transactional
	@Override
	public ApiResponse deleteAssignee(Long taskId, Long userId) {
		if(taskAssigneeRepository.getAssignee(userId,taskId)==null)
			throw new InvalidUnAssignmentException("Trying to unassign something that is not assigned to "+userId);
		return new ApiResponse("success","No of rows affected "+taskAssigneeRepository.deleteAssignee(userId,taskId));
	}




}
