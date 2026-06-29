package com.teamcollab.workspaceservice.sprint.repository;

import com.teamcollab.workspaceservice.sprint.entities.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SprintRepository extends JpaRepository<Sprint,Long> {
}
