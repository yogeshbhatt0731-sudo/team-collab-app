package com.teamcollab.workspaceservice.task.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class SmartSearchResponseDTO {
    private String summary;
    private List<TaskResponseDTO> tasks;
}
