package com.teamcollab.workspaceservice.sprint.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class SprintRequestDTO {
    @NotBlank(message = "Sprint name is required")
    private String name;
    @NotBlank(message = "Sprint goal is required")
    private String goal;
    private Long projectId;

}

