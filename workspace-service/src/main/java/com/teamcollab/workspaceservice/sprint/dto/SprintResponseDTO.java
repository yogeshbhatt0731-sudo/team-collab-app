package com.teamcollab.workspaceservice.sprint.dto;

import com.teamcollab.workspaceservice.sprint.entities.SprintStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SprintResponseDTO {

    private Long id;
    private Long createdBy;
    private SprintStatus sprintStatus;
    private String name;
    private String goal;
    private LocalDate startDate;
    private LocalDate endDate;

}