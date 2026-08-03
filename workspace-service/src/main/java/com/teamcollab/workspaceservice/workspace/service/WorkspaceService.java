package com.teamcollab.workspaceservice.workspace.service;

import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.workspace.dtos.WorkspaceDetailRespDto;
import com.teamcollab.workspaceservice.workspace.dtos.WorkspaceMemberDTO;
import com.teamcollab.workspaceservice.workspace.dtos.WorkspaceRequestDto;
import com.teamcollab.workspaceservice.workspace.entities.Workspace;

import java.util.List;


public interface WorkspaceService {

	public boolean exists (Long workspaceId);

	public ApiResponse addNewWorkspace(Long userId, WorkspaceRequestDto request);


	public Workspace getWorkspace(Long workspaceId);

	public WorkspaceDetailRespDto getWorkspaceDetail(Long userId, Long workspaceId);

	public List<WorkspaceDetailRespDto> getAllWorkspace(Long userId);

	public ApiResponse updateWorkspace(Long workspaceId, WorkspaceRequestDto workspaceRequestDto);

	ApiResponse deleteWorkspace(Long userId, Long workspaceId);

	List<WorkspaceMemberDTO> getWorkspaceMembers(Long workspaceId);

}
