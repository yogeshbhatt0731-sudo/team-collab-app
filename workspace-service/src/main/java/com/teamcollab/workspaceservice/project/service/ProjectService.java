package com.teamcollab.workspaceservice.project.service;

import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.project.dtos.ProjectRequestDto;
import com.teamcollab.workspaceservice.project.entities.Project;

import java.util.List;


public interface ProjectService {
    public ApiResponse addProject(Long userId, Long workspaceId, ProjectRequestDto projectRequestDto);

    public List<Project> getAllProjects(Long userId, Long workspaceId);

    public Project getProject(Long userId, Long projectId);

    public ApiResponse updateProject(Long userId, Long projectId, ProjectRequestDto oldProject);

    public ApiResponse deleteProject(Long userId, Long projectId);
}