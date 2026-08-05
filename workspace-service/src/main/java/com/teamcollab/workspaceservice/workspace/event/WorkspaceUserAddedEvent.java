package com.teamcollab.workspaceservice.workspace.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkspaceUserAddedEvent {

    private UUID eventId;

    private Long workspaceId;

    private String workspaceName;

    private Long addedUserId;

    private String addedUserName;

    private String addedUserEmail;

    private String role;

    private String addedBy;

    private LocalDateTime occurredOn;

}
