package com.teamcollab.workspaceservice.workspace.dtos;

import com.teamcollab.workspaceservice.workspace.entities.Role;

public record WorkspaceMemberDTO(Long userId, String name, String email, String userName, Role role) {
}
