package com.teamcollab.workspaceservice.task.repository;

import com.teamcollab.workspaceservice.task.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment,Long> {
}
