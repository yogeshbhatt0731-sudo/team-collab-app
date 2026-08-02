package com.teamcollab.workspaceservice.project.controller;

import com.teamcollab.workspaceservice.common.security.UserContext;
import com.teamcollab.workspaceservice.project.dtos.ProjectRequestDto;
import com.teamcollab.workspaceservice.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workspaces/{workspaceId}")
public class WorkspaceProjectController {


    private final ProjectService projectService;
    private final UserContext userContext;


    /*
     * Desc - Create Project
     * URL - http://host:port/workspaces/{workspaceId}/projects
     * Method - POST
     * Payload - UserId, ProjectRequestDto
     *    --name
     * Resp -  Project creating response
     *  failure -ApiResp-  err messg - Workspace not created
     */

    @PostMapping("/projects")
    public ResponseEntity<?> addProject(@PathVariable Long workspaceId,
                                        @RequestBody ProjectRequestDto projectRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.addProject(userContext.getUserId(), workspaceId, projectRequestDto));

    }

    @GetMapping("/projects")
    public ResponseEntity<?> getAllProjects(@PathVariable Long workspaceId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.getAllProjects(userContext.getUserId(), workspaceId));
    }

}
