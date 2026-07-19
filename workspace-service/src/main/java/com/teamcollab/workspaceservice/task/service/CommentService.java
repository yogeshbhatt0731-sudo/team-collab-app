package com.teamcollab.workspaceservice.task.service;

import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.task.dto.TaskCommentResponseDTO;

import java.util.List;

public interface CommentService {

	public ApiResponse addComment(Long taskId, String content);

	public List<TaskCommentResponseDTO> getComments(Long taskId);

	public ApiResponse updateComment(Long taskId, Long commentId, String content);

	public ApiResponse deleteComment(Long commentId, Long taskId);
}
