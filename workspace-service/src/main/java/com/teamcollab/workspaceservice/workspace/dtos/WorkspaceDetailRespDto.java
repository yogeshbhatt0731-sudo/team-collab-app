package com.teamcollab.workspaceservice.workspace.dtos;


import com.teamcollab.workspaceservice.workspace.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class WorkspaceDetailRespDto {
    Long user_id;
    Long workspace_id;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    String name;
    Role role;
}
