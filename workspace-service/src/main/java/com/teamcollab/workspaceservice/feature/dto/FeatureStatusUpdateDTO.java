package com.teamcollab.workspaceservice.feature.dto;

import com.teamcollab.workspaceservice.feature.entities.FeatureStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FeatureStatusUpdateDTO {
    private FeatureStatus featureStatus;
}
