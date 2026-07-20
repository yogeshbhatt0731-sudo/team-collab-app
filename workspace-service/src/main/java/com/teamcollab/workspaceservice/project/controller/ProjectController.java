package com.teamcollab.workspaceservice.project.controller;


import com.teamcollab.workspaceservice.project.dtos.ProjectRequestDto;
import com.teamcollab.workspaceservice.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping()
public class ProjectController {

    private final ProjectService projectService;

    /*
     * Desc - Create Project
     * URL - http://host:port/workspaces/{workspaceId}/projects
     * Method - POST
     * Payload - UserId, ProjectRequestDto
     *    --name
     * Resp -  Project creating response
     *  failure -ApiResp-  err messg - Workspace not created
     */

    @PostMapping("/workspaces/{workspaceId}/projects")
    public ResponseEntity<?> addProject(@RequestHeader("X-User-Id") Long userId,
                                        @PathVariable Long workspaceId,
                                        @RequestBody ProjectRequestDto projectRequestDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.addProject(userId, workspaceId, projectRequestDto));

    }

    @GetMapping("/workspaces/{workspaceId}/projects")
    public ResponseEntity<?> getAllProjects(@RequestHeader("X-User-Id") Long userId,
                                            @PathVariable Long workspaceId){
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.getAllProjects(userId, workspaceId));
    }

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<?> getProject(@RequestHeader("X-User-Id") Long userId,
                                        @PathVariable Long projectId){
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.getProject(userId, projectId));
    }

    @PutMapping("/projects/{projectId}")
    public ResponseEntity<?> updateProject(@RequestHeader("X-User-Id") Long userId,
                                           @PathVariable Long projectId,
                                           @RequestBody ProjectRequestDto newProject){
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.updateProject(userId, projectId, newProject));
    }

    @DeleteMapping("/projects/{projectId}")
    public ResponseEntity<?> deleteProject(@RequestHeader("X-User-Id") Long userId,
                                           @PathVariable Long projectId){
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.deleteProject(userId, projectId));
    }
}
