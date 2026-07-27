package com.teamcollab.workspaceservice.task.repository;

import com.teamcollab.workspaceservice.task.dto.TaskCommentResponseDTO;
import com.teamcollab.workspaceservice.task.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/*private Long commentId;
    private Long userId;
    private Long taskId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

 */

public interface CommentRepository extends JpaRepository<Comment,Long> {
    @Query("select new com.teamcollab.workspaceservice.task.dto.TaskCommentResponseDTO(c.id,c.userId,c.myTask.id,c.content,c.createdAt,c.updatedAt)" +
            "from Comment c where c.myTask.id=:id")
    public List<TaskCommentResponseDTO> getComments(@Param("id") Long id);

    // Wipe every comment on a task — used when the task itself is deleted
    // (comment.task_id is NOT NULL, so orphan comments would block the delete).
    @Modifying
    @Query("delete from Comment c where c.myTask.id=:tid")
    public int deleteByTask(@Param("tid") Long tid);
}
