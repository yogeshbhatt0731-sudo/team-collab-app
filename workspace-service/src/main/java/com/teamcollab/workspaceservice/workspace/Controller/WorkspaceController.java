package com.teamcollab.workspaceservice.workspace.Controller;


import com.teamcollab.workspaceservice.workspace.dtos.WorkspaceRequestDto;
import com.teamcollab.workspaceservice.workspace.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

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
    public ResponseEntity<?> createWorkspace(@RequestHeader("X-User-Id") Long userId,
                                             @RequestBody WorkspaceRequestDto request){

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(workspaceService
                        .addNewWorkspace(userId, request));

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
                        .getWorkspace(workspaceId));
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
    public ResponseEntity<?> getAllWorkspaces(@RequestHeader("X-User-Id") Long userId){
        return ResponseEntity.ok(workspaceService
                .getAllWorkspace(userId));
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
    public ResponseEntity<?> deleteWorkspace(@RequestHeader("X-User-Id") Long userId, @PathVariable Long workspaceId){
        return ResponseEntity.ok(workspaceService.deleteWorkspace(userId, workspaceId));
    }

//    @GetMapping("/search")
//    public ResponseEntity<?> searchWorkspace(...)
//
//    @GetMapping("/{workspaceId}/exists")
//    public ResponseEntity<?> exists(...)
}
