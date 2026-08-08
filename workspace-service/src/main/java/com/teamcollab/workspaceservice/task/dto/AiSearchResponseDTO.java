package com.teamcollab.workspaceservice.task.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AiSearchResponseDTO {
    private List<Integer> task_ids;
    private String summary;
}
