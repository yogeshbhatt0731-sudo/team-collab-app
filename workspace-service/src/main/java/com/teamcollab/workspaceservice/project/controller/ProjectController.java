package com.teamcollab.workspaceservice.project.controller;


import com.teamcollab.workspaceservice.common.security.UserContext;
import com.teamcollab.workspaceservice.project.dtos.ProjectRequestDto;
import com.teamcollab.workspaceservice.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:5173", "http://8.231.96.214"}, allowedHeaders = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserContext userContext;

    @GetMapping
    public ResponseEntity<?> getMyProjects() {
        return ResponseEntity.ok(projectService.getMyProjects(userContext.getUserId()));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<?> getProject(@PathVariable Long projectId){
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.getProject(userContext.getUserId(), projectId));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<?> updateProject(@PathVariable Long projectId,
                                           @RequestBody ProjectRequestDto newProject){
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.updateProject(userContext.getUserId(), projectId, newProject));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable Long projectId){
        return ResponseEntity.status(HttpStatus.OK)
                .body(projectService.deleteProject(userContext.getUserId(), projectId));
    }
}
