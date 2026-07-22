package com.teamcollab.workspaceservice.sprint.service;

import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.sprint.dto.SprintRequestDTO;
import com.teamcollab.workspaceservice.sprint.dto.SprintResponseDTO;
import com.teamcollab.workspaceservice.sprint.dto.SprintStatusUpdateDTO;
import com.teamcollab.workspaceservice.sprint.dto.SprintUpdateRequestDTO;
import com.teamcollab.workspaceservice.sprint.entities.Sprint;

import java.util.List;

public interface SprintService {

    Sprint assertExists(Long sprintId);

    ApiResponse createSprint(SprintRequestDTO sprintRequestDTO);

    List <SprintResponseDTO> getAllSprints(Long projectId);

    SprintResponseDTO  getSprintDetails(Long sprintId);

    ApiResponse updateSprintStatus(Long sprintId, SprintStatusUpdateDTO sprintStatusUpdateDTO);

    ApiResponse updateSprint(Long sprintId, SprintUpdateRequestDTO sprintUpdateRequestDTO);

    ApiResponse deleteSprint(Long sprintId);
}
