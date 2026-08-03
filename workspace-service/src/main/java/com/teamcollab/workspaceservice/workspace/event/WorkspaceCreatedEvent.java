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
public class WorkspaceCreatedEvent {

    private UUID eventId;

    private String workspaceName;

    private String createdBy;

    private String createdByEmail;

    private LocalDateTime occurredOn;

}
