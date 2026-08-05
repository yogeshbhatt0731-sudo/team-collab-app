package com.teamcollab.workspaceservice.workspace.Controller;


import com.teamcollab.workspaceservice.common.security.UserContext;
import com.teamcollab.workspaceservice.workspace.dtos.InviteMemberRequestDto;
import com.teamcollab.workspaceservice.workspace.dtos.WorkspaceRequestDto;
import com.teamcollab.workspaceservice.workspace.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;
    private final UserContext userContext;

    /*
     * Desc - Create Workspace
     * URL - http://host:port/workspaces
     * Method - POST
     * Payload - UserId, WorkspaceRequestDto
     *    --name
     * Resp -  Workspace creating response
     *  failure -ApiResp-  err mesg - Workspace not created
     */

    @PostMapping
    public ResponseEntity<?> createWorkspace(@RequestBody WorkspaceRequestDto request){

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(workspaceService
                        .addNewWorkspace(userContext.getUserId(),request));

    }


    /*
     * Desc - Get Workspace by Id
     * URL - http://host:port/workspaces/{workspaceId}
     * Method - GET
     * Payload - none
     * Resp -  ApiResp - success SC OK - Workspace Entity
     *  empty list - SC 204
     */

    @GetMapping("/{workspaceId}")
    public ResponseEntity<?> getWorkspace(@PathVariable Long workspaceId){
        return ResponseEntity.ok(workspaceService
                        .getWorkspaceDetail(userContext.getUserId(), workspaceId));
    }


    /*
     * Desc - Get all delivered orders within last hour
     * URL - http://host:port/workspaces
     * Method - GET
     * Payload - UserId
     * Resp -  ApiResp - success SC OK - list of Workspace Entities
     *  empty list - SC 204
     */

    @GetMapping
    public ResponseEntity<?> getAllWorkspaces(){
        return ResponseEntity.ok(workspaceService
                .getAllWorkspace(userContext.getUserId()));
    }

    /*
     * Desc - Update Workspace
     * URL - http://host:port/workspaces/{workspaceId}
     * Method - POST
     * Payload -  WorkspaceRequestDto
     *    --name
     * Resp -   UPfating Workspace response
     *  failure -ApiResp-  err mesg - Workspace not created
     */

    @PutMapping("/{workspaceId}")
    public ResponseEntity<?> updateWorkspace(@PathVariable Long workspaceId, @RequestBody WorkspaceRequestDto workspaceRequestDto){
        return ResponseEntity.ok(workspaceService.updateWorkspace(workspaceId, workspaceRequestDto));
    }


    /*
     * REST API end point -
     * desc - delete workspace
     * URL-http://host:port/workspaces/{workspaceId}
     * Method - DELETE
     * Payload - none
     * Resp - ApiResponse
     */

    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<?> deleteWorkspace(@PathVariable Long workspaceId){
        return ResponseEntity.ok(workspaceService.deleteWorkspace(userContext.getUserId(),workspaceId));
    }

    @GetMapping("/{workspaceId}/members")
    public ResponseEntity<?> getWorkspaceMembers(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(workspaceService.getWorkspaceMembers(workspaceId));
    }

    @PostMapping("/{workspaceId}/members")
    public ResponseEntity<?> addMember(
            @PathVariable Long workspaceId,
            @Valid @RequestBody InviteMemberRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(workspaceService.addMember(userContext.getUserId(), workspaceId, request.getEmail()));
    }

//    @GetMapping("/search")
//    public ResponseEntity<?> searchWorkspace(...)
//
//    @GetMapping("/{workspaceId}/exists")
//    public ResponseEntity<?> exists(...)
}
