package com.teamcollab.workspaceservice.feature.service;

import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.feature.dto.FeatureRequestDTO;
import com.teamcollab.workspaceservice.feature.dto.FeatureResponseDTO;
import com.teamcollab.workspaceservice.feature.dto.FeatureStatusUpdateDTO;
import com.teamcollab.workspaceservice.feature.entities.Feature;

import java.util.List;

public interface FeatureService {
    Feature assertExists(Long featureId);

    ApiResponse createFeature(FeatureRequestDTO featureRequestDTO);

    List<FeatureResponseDTO> getAllFeatures(Long projectId);

    FeatureResponseDTO getFeatureDetails(Long featureId);

    ApiResponse updateFeatureStatus(Long featureId, FeatureStatusUpdateDTO featureStatusUpdateDTO);

    ApiResponse deleteFeature(Long featureId);
}
