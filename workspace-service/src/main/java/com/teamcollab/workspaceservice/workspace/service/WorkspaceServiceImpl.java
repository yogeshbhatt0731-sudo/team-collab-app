package com.teamcollab.workspaceservice.workspace.service;


import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.common.exception.UnauthorizedException;
import com.teamcollab.workspaceservice.workspace.exception.WorkspaceNotFoundException;
import com.teamcollab.workspaceservice.workspace.dtos.WorkspaceDetailRespDto;
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

import java.util.List;

@Service
@Transactional(readOnly = false)
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceUserRepository workspaceUserRepository;
    private final ModelMapper modelMapper;

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

        return new ApiResponse("success", "Created " + workspace.getName() + " Successfully");

    }

    @Override
    public Workspace getWorkspace(Long workspaceId) {
        //find workspace by id
        return workspaceRepository.findById(workspaceId).orElseThrow(() -> new WorkspaceNotFoundException("Worksapce not found for this is"));
    }


    @Override
    public List<WorkspaceDetailRespDto> getAllWorkspace(Long userId) {
//        List<Workspace> list = workspaceRepository.findByCreatedBy(userId);
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

//        //get workspaceuser by userid
//        WorkspaceUser workspaceUser = workspaceUserRepository.workspaceUserFindByUserId(userId);
//        System.out.println("ws: " + workspaceUser);
//
//
//        //check user is eligible or not to delete
//        if(workspaceUser.getRole() != Role.OWNER) {
//            throw new UnauthorizedException("Unauthorize Access!!! Only Owner Can delete workspace");
//        }
//
//        //get all worksapces for workspaceid
//        List<WorkspaceUser> workspaceUserList = workspaceUserRepository.findByWorkspaceId(workspaceId);
//
//        //delete all workspaces;
//        workspaceUserRepository.deleteAll(workspaceUserList);
//
////        for(WorkspaceUser w : workspaceUserList)
////            System.out.println(w.getWorkspaceUserId() + "" + w.getRole());
//
//        //get Workspace by workspaceid and delete it
//        workspaceRepository.deleteById(workspaceId);



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
}
