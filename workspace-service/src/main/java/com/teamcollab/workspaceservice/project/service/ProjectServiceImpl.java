package com.teamcollab.workspaceservice.project.service;

import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.common.exception.UnauthorizedException;
import com.teamcollab.workspaceservice.project.dtos.ProjectRequestDto;
import com.teamcollab.workspaceservice.project.dtos.ProjectSummaryDto;
import com.teamcollab.workspaceservice.project.entities.Project;
import com.teamcollab.workspaceservice.project.entities.ProjectAccess;
import com.teamcollab.workspaceservice.project.entities.WorkSpaceProjectUserId;
import com.teamcollab.workspaceservice.project.exception.ProjectNotFoundException;
import com.teamcollab.workspaceservice.project.repository.ProjectAccessRepository;
import com.teamcollab.workspaceservice.workspace.entities.Role;
import com.teamcollab.workspaceservice.workspace.entities.Workspace;
import com.teamcollab.workspaceservice.workspace.entities.WorkspaceUser;
import com.teamcollab.workspaceservice.workspace.entities.WorkspaceUserId;
import com.teamcollab.workspaceservice.workspace.exception.WorkspaceNotFoundException;
import com.teamcollab.workspaceservice.workspace.repository.WorkspaceUserRepository;
import com.teamcollab.workspaceservice.workspace.service.WorkspaceService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamcollab.workspaceservice.project.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Service
@Transactional(readOnly = false)
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
	private final ProjectRepository projectRepository;
	private final ProjectAccessRepository projectAccessRepository;
	private final WorkspaceService workspaceService;
	private final WorkspaceUserRepository workspaceUserRepository;
	private final ModelMapper modelMapper;

	public ApiResponse addProject(Long userId, Long workspaceId, ProjectRequestDto projectRequestDto){

		//Check if Workspace exist or not
		if(!workspaceService.exists(workspaceId)){
			throw new WorkspaceNotFoundException("No workspace found");
		}

		//Get WorkspaceUser entity for Authorization
		WorkspaceUserId workspaceUserId = new WorkspaceUserId();
		workspaceUserId.setUserId(userId);
		workspaceUserId.setWorkspaceId(workspaceId);

		WorkspaceUser workspaceUser =
				workspaceUserRepository.findById(workspaceUserId)
						.orElseThrow(() ->
								new UnauthorizedException(
										"User is not a member"));

		//Authorization Validation
		if(workspaceUser.getRole() != Role.OWNER){
			throw new UnauthorizedException("Not authorized for create project!!!. Only owner can create workspace");
		}

		//Get Workspace to save relation @OneToMany 1 --->*
		Workspace workspace = workspaceService.getWorkspace(workspaceId);

		//Create Project entity for save
		Project newProject = modelMapper.map(projectRequestDto, Project.class);
		newProject.setCreatedBy(userId);
		newProject.setMyWorkspace(workspace);

		//Save entity into db
		projectRepository.save(newProject);

		//Create entity of Workspace-projectUserId to set
		WorkSpaceProjectUserId workSpaceProjectUserId = new WorkSpaceProjectUserId();
		workSpaceProjectUserId.setProjectId(newProject.getId());
		workSpaceProjectUserId.setUserId(userId);
		workSpaceProjectUserId.setWorkspaceId(workspaceId);

		//Set Entity to Project Access Table
		ProjectAccess projectAccess = new ProjectAccess();
		projectAccess.setWorkSpaceProjectUserId(workSpaceProjectUserId);
		projectAccessRepository.save(projectAccess);

		return new ApiResponse("success", "Project " + newProject.getName() +" Successfully added");
	}

	public List<Project> getAllProjects(Long userId, Long workspaceId){

		WorkspaceUserId id =
				new WorkspaceUserId(workspaceId, userId);

		workspaceUserRepository.findById(id)
				.orElseThrow(() ->
						new UnauthorizedException(
								"You are not a member of this workspace"));
		List<Project> list = projectRepository.findAllByMyWorkspaceId(workspaceId);
		return list;
	}

	@Override
	public List<ProjectSummaryDto> getMyProjects(Long userId) {
		return projectRepository.findAllByUserId(userId);
	}

	public Project getProject(Long userId, Long projectId){

		Project project =
				projectRepository.findById(projectId)
						.orElseThrow(() ->
								new ProjectNotFoundException("Project not found"));

		Long workspaceId =
				project.getMyWorkspace().getId();

		WorkspaceUserId id =
				new WorkspaceUserId(workspaceId, userId);

		workspaceUserRepository.findById(id)
				.orElseThrow(() ->
						new UnauthorizedException(
								"You are not a member"));

		return project;
	}

	public ApiResponse updateProject(Long userId, Long projectId, ProjectRequestDto newProject){

		Project oldProject = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException("Project Not Found"));

		if (!oldProject.getCreatedBy().equals(userId))
			throw new UnauthorizedException("Not Authorized for Update");

		modelMapper.map(newProject, oldProject);
		projectRepository.save(oldProject);

		return new ApiResponse("success", "Project Updated");

	}


	public ApiResponse deleteProject(Long userId, Long projectId){

		Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectNotFoundException("Project Not Found"));

		if (!project.getCreatedBy().equals(userId))
			throw new UnauthorizedException("Not Authorized for Update");

		WorkSpaceProjectUserId workSpaceProjectUserId = new WorkSpaceProjectUserId();
		workSpaceProjectUserId.setProjectId(projectId);
		workSpaceProjectUserId.setWorkspaceId(project.getMyWorkspace().getId());
		workSpaceProjectUserId.setUserId(userId);

		projectAccessRepository.deleteById(workSpaceProjectUserId);

		projectRepository.delete(project);

		return new ApiResponse("success", "Project Deleted");

	}

}
