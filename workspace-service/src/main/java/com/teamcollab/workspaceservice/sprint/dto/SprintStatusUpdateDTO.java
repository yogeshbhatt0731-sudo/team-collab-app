package com.teamcollab.workspaceservice.sprint.dto;

import com.teamcollab.workspaceservice.sprint.entities.SprintStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class SprintStatusUpdateDTO {
    private SprintStatus sprintStatus;

}
