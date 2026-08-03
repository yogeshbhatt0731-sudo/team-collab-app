package com.teamcollab.workspaceservice.workspace.service;


import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.common.dtos.UserDetailsDTO;
import com.teamcollab.workspaceservice.common.exception.UnauthorizedException;
import com.teamcollab.workspaceservice.common.feign.AuthServiceClient;
import com.teamcollab.workspaceservice.common.messaging.RabbitMQPublisher;
import com.teamcollab.workspaceservice.workspace.event.WorkspaceCreatedEvent;
import com.teamcollab.workspaceservice.workspace.exception.WorkspaceNotFoundException;
import com.teamcollab.workspaceservice.workspace.dtos.WorkspaceDetailRespDto;
import com.teamcollab.workspaceservice.workspace.dtos.WorkspaceMemberDTO;
import com.teamcollab.workspaceservice.workspace.dtos.WorkspaceRequestDto;
import com.teamcollab.workspaceservice.workspace.entities.Role;
import com.teamcollab.workspaceservice.workspace.entities.Workspace;
import com.teamcollab.workspaceservice.workspace.entities.WorkspaceUser;
import com.teamcollab.workspaceservice.workspace.entities.WorkspaceUserId;
import com.teamcollab.workspaceservice.workspace.repository.WorkspaceRepository;
import com.teamcollab.workspaceservice.workspace.repository.WorkspaceUserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = false)
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceUserRepository workspaceUserRepository;
    private final AuthServiceClient authServiceClient;
    private final ModelMapper modelMapper;
    private final RabbitMQPublisher publisher;

    public boolean exists(Long workspaceId){
        return workspaceRepository.existsById(workspaceId);
    }

    public ApiResponse addNewWorkspace(Long userId, WorkspaceRequestDto request){
        Workspace workspace = modelMapper.map(request, Workspace.class);
        workspace.setCreatedBy(userId);

        Workspace saveWorkspace = workspaceRepository.save(workspace);

        WorkspaceUserId workspaceUserId = new WorkspaceUserId();
        workspaceUserId.setWorkspaceId(saveWorkspace.getId());
        workspaceUserId.setUserId(userId);

        WorkspaceUser workspaceUser = new WorkspaceUser();
        workspaceUser.setWorkspaceUserId(workspaceUserId);
        workspaceUser.setRole(Role.OWNER);

        workspaceUserRepository.save(workspaceUser);
        List<Long> list = List.of(userId);

        WorkspaceCreatedEvent workspaceCreatedEvent = new WorkspaceCreatedEvent()
                .builder()
                .eventId(UUID.randomUUID())
                .workspaceName(request.getName())
                .createdBy(authServiceClient.getUsersById(list).get(0).userName())
                .createdByEmail(authServiceClient.getUsersById(list).get(0).email())
                .occurredOn(LocalDateTime.now())
                .build();

        publisher.publishWorkspaceCreated(workspaceCreatedEvent);

        return new ApiResponse("success", "Created " + workspace.getName() + " Successfully");

    }

    @Override
    public Workspace getWorkspace(Long workspaceId) {
        return workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceNotFoundException("Workspace not found"));
    }

    @Override
    public WorkspaceDetailRespDto getWorkspaceDetail(Long userId, Long workspaceId) {
        return workspaceRepository.findWorkspaceDetail(workspaceId, userId)
                .orElseThrow(() -> new WorkspaceNotFoundException("Workspace not found or user is not a member"));
    }


    @Override
    public List<WorkspaceDetailRespDto> getAllWorkspace(Long userId) {
        List<WorkspaceDetailRespDto> list = workspaceRepository.findAllWorkspace(userId);
        return list;
    }

    @Override
    public ApiResponse updateWorkspace(Long workspaceId, WorkspaceRequestDto workspaceRequestDto) {
        //1.Find by id
        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow(() -> new WorkspaceNotFoundException("Workspace not found!!!"));

        //2. Model map the entity
        modelMapper.map(workspaceRequestDto, workspace);
        workspaceRepository.save(workspace);

        return new ApiResponse("success", "Workspace name Changes to " + workspaceRequestDto.getName());

    }

    @Override
    public ApiResponse deleteWorkspace(Long userId, Long workspaceId) {

        WorkspaceUserId id = new WorkspaceUserId(workspaceId, userId);

        WorkspaceUser workspaceUser =
                workspaceUserRepository.findById(id)
                        .orElseThrow(() ->
                                new UnauthorizedException("User is not a member of this workspace"));

        if (workspaceUser.getRole() != Role.OWNER) {
            throw new UnauthorizedException(
                    "Only workspace owner can delete workspace");
        }

        workspaceUserRepository.deleteAllByWorkspaceId(workspaceId);

        workspaceRepository.deleteById(workspaceId);


        return new ApiResponse("success", "ws deleted");
    }

    @Override
    public List<WorkspaceMemberDTO> getWorkspaceMembers(Long workspaceId) {
        if (!workspaceRepository.existsById(workspaceId)) {
            throw new WorkspaceNotFoundException("Workspace not found");
        }

        List<WorkspaceUser> workspaceUsers = workspaceUserRepository.findByWorkspaceId(workspaceId);

        List<Long> userIds = workspaceUsers.stream()
                .map(wu -> wu.getWorkspaceUserId().getUserId())
                .toList();

        Map<Long, Role> roleMap = workspaceUsers.stream()
                .collect(Collectors.toMap(
                        wu -> wu.getWorkspaceUserId().getUserId(),
                        WorkspaceUser::getRole
                ));

        List<UserDetailsDTO> profiles = authServiceClient.getUsersById(userIds);

        return profiles.stream()
                .map(p -> new WorkspaceMemberDTO(
                        p.userId(),
                        p.name(),
                        p.email(),
                        p.userName(),
                        roleMap.getOrDefault(p.userId(), Role.MEMBER)
                ))
                .toList();
    }
}
