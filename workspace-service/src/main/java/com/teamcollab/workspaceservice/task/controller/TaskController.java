package com.teamcollab.workspaceservice.task.controller;


import com.teamcollab.workspaceservice.task.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.teamcollab.workspaceservice.task.service.TaskService;
import com.teamcollab.workspaceservice.task.service.CommentService;



import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = {"http://localhost:5173", "http://8.231.96.214"}, allowedHeaders = "*")
@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
public class TaskController {
	private final TaskService taskService;
	private final CommentService commentService;



	/*
	 *  Desc - Create Task
	 *  Uri - /task
	 *  method - POST
	 *  Payload - TaskRequestDTO
	 *  			String title 
					String description
					TaskPriority taskPriority
					TaskType taskType
					LocalDateTime dueDate
					Long projectID;
		Resp - ApiResponse succ mesg ;
			failure - ApiResponse err mesg
			SC 201
	 *   
	 */
	@PostMapping
	public ResponseEntity<?> createTask(@RequestBody TaskRequestDTO taskRequestDTO)
	{
		return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(taskRequestDTO));	
	}
	
	/*
	 * Desc - Get Task
	 * Uri - /task
	 * method - GET
	 * uri variable - {task_id}
	 * Resp - TaskResponseDTO
	 * 
	 */

	// GET /task/assigned  ->  "My Board": tasks assigned to the current user (across all projects).
	// No param — the user comes from X-User-Id (userContext). This is a LITERAL path, so Spring
	// matches it before the {task_id} variable mapping below (it won't try to parse "assigned" as an id).
	@GetMapping("assigned")
	public ResponseEntity<?> getAssignedTasks()
	{
		return ResponseEntity.ok(taskService.getAssignedTasks());
	}

	@GetMapping("{task_id}")
	public ResponseEntity<?> getTask(@PathVariable(name = "task_id") Long taskId)
	{
		return ResponseEntity.ok(taskService.getTask(taskId));
	}


	// GET /task?projectId=123
	@GetMapping
	public ResponseEntity<?> getAllTasks(@RequestParam Long projectId)
	{
		return ResponseEntity.ok(taskService.getTasksByProject(projectId));
	}


	/*
	 * Desc - Update Task
	 * Uri - /task/{task_id}
	 * method - Patch
	 * PayLoad - TaskUpdateDTO
	 *  			String title
					String description
					TaskPriority taskPriority
					TaskType taskType
					LocalDateTime dueDate
	 * Resp - ApiResponse , succ mesg/err mesg
	 *
	 */

	@PatchMapping("{task_id}")
	public ResponseEntity<?> updateTaskById(@PathVariable(name = "task_id") Long taskId,@RequestBody TaskUpdateDTO taskUpdateDTO)
	{
		return ResponseEntity.ok(taskService.updateTaskById(taskId,taskUpdateDTO));
	}

	/*
	 Desc - Change Task Status
	 Uri - /task/{task_id}
	 method - Patch
	 Payload - TaskStatusUpdateDTO
	 			TaskStatus taskStatus
	 Resp - ApiResponse , succ mesg/err mesg

	 */

	@PatchMapping("{task_id}/status")
	public ResponseEntity<?> changeTaskStatusById(@PathVariable(name = "task_id") Long taskId,@RequestBody TaskStatusUpdateDTO taskStatusUpdateDTO)
	{
		return ResponseEntity.ok(taskService.changeTaskStatusById(taskId,taskStatusUpdateDTO));
	}



	// Task Assignee  Endpoints

	/*
	 Desc - Assign task
	 Uri - /task/{task_id}/assignees
	 method - POST
	 Payload - TaskAssigneeRequestDTO
	 Resp - ApiResponse , succ mesg/err mesg
	 */

	@PostMapping("{task_id}/assignees")
	public ResponseEntity<?> assignTask(@PathVariable(name = "task_id")Long taskId, @RequestBody TaskAssigneeRequestDTO taskAssigneeRequestDTO)
	{
		return ResponseEntity.status(HttpStatus.CREATED).body(taskService.assignTask(taskId,taskAssigneeRequestDTO.getUserId()));
	}

	/*
	 Desc - Get All Assignees for a particular  task
	 Uri - /task/{task_id}/assignees
	 method - GET
	 Resp - List<TaskAssigneeResponseDTO>
	 */

	@GetMapping("{task_id}/assignees")
	public ResponseEntity<?> getAssignees(@PathVariable(name = "task_id") Long taskId)
	{
		return ResponseEntity.ok(taskService.getAssignees(taskId));
	}

	/*
	 Desc - Unassign a task
	 Uri - /task/{task_id}/assigness
	 method - DELETE
	 Payload - TaskAssigneeRequestDTO
	 Resp - ApiResponse , succ mesg/err mesg
	 */

	@DeleteMapping("{task_id}/assignees")
	public ResponseEntity<?> deleteAssignee(@PathVariable(name = "task_id") Long taskId, @RequestBody TaskAssigneeRequestDTO taskAssigneeRequestDTO)
	{
		return ResponseEntity.ok(taskService.deleteAssignee(taskId,taskAssigneeRequestDTO.getUserId()));
	}

	// Comment endpoints

	@PostMapping("{task_id}/comments")
	public ResponseEntity<?> addComment(@PathVariable(name = "task_id")Long taskId, @RequestBody TaskCommentRequestDTO taskCommentRequestDTO)
	{
		return ResponseEntity.status(HttpStatus.CREATED).body(commentService.addComment(taskId, taskCommentRequestDTO.getContent()));
	}

	@GetMapping("{task_id}/comments")
	public ResponseEntity<?> getComments(@PathVariable(name = "task_id") Long taskId)
	{
		return ResponseEntity.ok(commentService.getComments(taskId));
	}

	@PatchMapping("{task_id}/comments/{comment_id}")
	public ResponseEntity<?> updateComment(@PathVariable(name = "task_id")Long taskId,@PathVariable(name = "comment_id")Long commentId,@RequestBody TaskCommentRequestDTO taskCommentRequestDTO)
	{
		return ResponseEntity.ok(commentService.updateComment(taskId,commentId,taskCommentRequestDTO.getContent()));
	}

	@DeleteMapping("{task_id}/comments/{comment_id}")
	public ResponseEntity<?> deleteComment(@PathVariable(name = "task_id")Long taskId, @PathVariable(name = "comment_id")Long commentId)
	{
		return ResponseEntity.ok(commentService.deleteComment(commentId,taskId));
	}

}

