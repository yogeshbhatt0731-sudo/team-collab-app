package com.teamcollab.workspaceservice.feature.dto;


import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class FeatureRequestDTO {
    @NotBlank(message = "feature name is required")
    private String name;
    @NotNull(message = "projectId is required")
    private Long projectId;

    @NotNull(message = "dueDate is required")
    @Future(message = "dueDate should be in future")
    private LocalDate dueDate;
}
