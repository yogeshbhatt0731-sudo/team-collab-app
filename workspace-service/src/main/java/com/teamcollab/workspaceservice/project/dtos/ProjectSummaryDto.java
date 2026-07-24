package com.teamcollab.workspaceservice.project.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ProjectSummaryDto {
    private Long projectId;
    private String projectName;
    private Long workspaceId;
    private String workspaceName;
    private LocalDateTime createdAt;
}
