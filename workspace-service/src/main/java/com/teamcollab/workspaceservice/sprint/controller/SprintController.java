package com.teamcollab.workspaceservice.sprint.controller;

import com.teamcollab.workspaceservice.sprint.dto.SprintRequestDTO;
import com.teamcollab.workspaceservice.sprint.dto.SprintStatusUpdateDTO;
import com.teamcollab.workspaceservice.sprint.dto.SprintUpdateRequestDTO;
import com.teamcollab.workspaceservice.sprint.service.SprintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class SprintController {

    private final SprintService sprintService;

    /**
     *desc- create a sprint for an existing project
     * uri - /sprints
     * method - POST
     * payload - SprintRequestDTO
     *           project_id
     *           sprint_name
     *           sprint_goal
     * response - APIResponse success message
     *            status_code  - 201
     *           failure - APIResponse error message
     */
    @PostMapping("/sprints")
    public ResponseEntity<?> createSprint( @Valid @RequestBody SprintRequestDTO sprintRequestDTO)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(sprintService.createSprint(sprintRequestDTO));
    }



    /**
     * desc- get all the sprints associated with a project
     * uri - /projects/{projectId}/sprints
     * method - GET
     * response - List<SprintResponseDTO> i.e. list of all sprints
     *          failure - invalid project id.
     */
    @GetMapping("/projects/{projectId}/sprints")
    public ResponseEntity<?> getAllSprints(@PathVariable Long projectId){

        return  ResponseEntity.ok(sprintService.getAllSprints(projectId));
    }

    /**
     *desc - get sprint details related to a particular sprint
     * uri - /sprints/{sprintId}
     * method - GET
     * response - sprintResponseDTO i.e all the sprint's details
     *           failure - not found
     *           sc-404
     */

    @GetMapping("/sprints/{sprintId}")
    public ResponseEntity<?> getAllSprintDetails(@PathVariable Long sprintId){

        return ResponseEntity.ok(sprintService.getSprintDetails(sprintId));

    }

    /**
     * desc - update status of a sprint
     * uri - /sprints/{sprintId}/status
     * method - PATCH
     * response - api response update successfully
     */

    @PatchMapping("/sprints/{sprintId}/status")
    public ResponseEntity <?> updateSprintStatus (@PathVariable Long sprintId , @RequestBody SprintStatusUpdateDTO sprintStatusUpdateDTO){

        return ResponseEntity.ok(sprintService.updateSprintStatus(sprintId,sprintStatusUpdateDTO));
    }

    @PatchMapping("/sprints/{sprintId}")
    public ResponseEntity <?> updateSprint (@PathVariable Long sprintId , @RequestBody SprintUpdateRequestDTO sprintUpdateRequestDTO) {

        return ResponseEntity.ok(sprintService.updateSprint(sprintId,sprintUpdateRequestDTO));
    }

    @DeleteMapping("sprints/{sprintId}")
    public ResponseEntity <?> deleteSprint (@PathVariable Long sprintId ) {

        return ResponseEntity.ok(sprintService.deleteSprint(sprintId));
    }
}

