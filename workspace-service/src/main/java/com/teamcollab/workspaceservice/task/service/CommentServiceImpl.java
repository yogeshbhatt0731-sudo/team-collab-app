package com.teamcollab.workspaceservice.task.service;

import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.common.dtos.UserDetailsDTO;
import com.teamcollab.workspaceservice.common.feign.AuthServiceClient;
import com.teamcollab.workspaceservice.common.security.UserContext;
import com.teamcollab.workspaceservice.task.dto.TaskCommentResponseDTO;
import com.teamcollab.workspaceservice.task.entities.Comment;
import com.teamcollab.workspaceservice.task.entities.Task;
import com.teamcollab.workspaceservice.task.exception.CommentNotFoundException;
import com.teamcollab.workspaceservice.task.exception.ForbiddenException;
import com.teamcollab.workspaceservice.task.exception.TaskNotFoundException;
import com.teamcollab.workspaceservice.task.repository.CommentRepository;
import com.teamcollab.workspaceservice.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final UserContext userContext;
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;
    private final AuthServiceClient authServiceClient;

    @Transactional
    @Override
    public ApiResponse addComment(Long taskId, String content) {

        Task task = taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task with taskId "+taskId+" not found!!"));
        Comment comment = new Comment();
        comment.setMyTask(task);
        comment.setUserId(userContext.getUserId());
        comment.setContent(content);
        commentRepository.save(comment);
        return new  ApiResponse("success", "Comment created successfully with task id "+taskId);
    }

    @Override
    public List<TaskCommentResponseDTO> getComments(Long taskId) {
        List<TaskCommentResponseDTO> comments = commentRepository.getComments(taskId);
        if (comments.isEmpty())
            return comments;

        // get all distinct user ids from the comments
        List<Long> userIds = comments.stream().
                map(t -> t.getUserId()).distinct().toList();

        // inter service call to auth-service to get full user details of these ids
        List<UserDetailsDTO> userDetails = authServiceClient.getUsersById(userIds);

        // add the user details data to its corresponding userId
        Map<Long,UserDetailsDTO> userDetailsMap = userDetails.stream()
                .collect(Collectors.toMap(
                        u -> u.userId(),u->u
                ));

        comments.forEach(c -> {
            UserDetailsDTO userDetail = userDetailsMap.get(c.getUserId());
            if(userDetail != null)
            {
                c.setAuthorName(userDetail.name());
            }
        });

        return comments;
    }

    @Transactional
    @Override
    public ApiResponse updateComment(Long taskId, Long commentId, String content) {

        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException("Comment with id "+commentId+" not found!!"));
        if(!comment.getUserId().equals(userContext.getUserId())||!comment.getMyTask().getId().equals(taskId))
            throw new ForbiddenException("You are not allowed to update comments for this task");
        comment.setContent(content);
        return new ApiResponse("success","Comment updated successfully !!");
    }

    @Transactional
    @Override
    public ApiResponse deleteComment(Long commentId, Long taskId) {

        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException("Comment with id "+commentId+" not found!!"));
        if(!comment.getUserId().equals(userContext.getUserId())||!comment.getMyTask().getId().equals(taskId))
            throw new ForbiddenException("You are not allowed to update comments for this task");
        commentRepository.deleteById(commentId);
        return new ApiResponse("success","Comment deleted successfully !!");
    }
}
