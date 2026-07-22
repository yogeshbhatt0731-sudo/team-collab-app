package com.teamcollab.workspaceservice.feature.dto;

import com.teamcollab.workspaceservice.feature.entities.FeatureStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FeatureResponseDTO {

    private Long id;
    private String name;
    private long createdBy;
    private FeatureStatus featureStatus;
    private LocalDate dueDate;
}
