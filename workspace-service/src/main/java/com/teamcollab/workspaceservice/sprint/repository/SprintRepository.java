package com.teamcollab.workspaceservice.sprint.repository;

import com.teamcollab.workspaceservice.sprint.dto.SprintResponseDTO;
import com.teamcollab.workspaceservice.sprint.entities.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SprintRepository extends JpaRepository<Sprint, Long > {

    List<Sprint> findByMyProjectId(Long projectId);

}
