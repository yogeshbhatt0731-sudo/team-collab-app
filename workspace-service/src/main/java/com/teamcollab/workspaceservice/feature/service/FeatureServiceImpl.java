package com.teamcollab.workspaceservice.feature.service;


import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.common.security.UserContext;
import com.teamcollab.workspaceservice.feature.dto.FeatureRequestDTO;
import com.teamcollab.workspaceservice.feature.dto.FeatureResponseDTO;
import com.teamcollab.workspaceservice.feature.dto.FeatureStatusUpdateDTO;
import com.teamcollab.workspaceservice.feature.entities.Feature;
import com.teamcollab.workspaceservice.feature.entities.FeatureStatus;
import com.teamcollab.workspaceservice.feature.exception.FeatureNotFoundException;
import com.teamcollab.workspaceservice.feature.exception.InvalidFeatureStatusTransitionException;
import com.teamcollab.workspaceservice.feature.repository.FeatureRepository;
import com.teamcollab.workspaceservice.project.entities.Project;
import com.teamcollab.workspaceservice.project.exception.ProjectNotFoundException;
import com.teamcollab.workspaceservice.project.repository.ProjectAccessRepository;
import com.teamcollab.workspaceservice.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class FeatureServiceImpl implements FeatureService {

    private final FeatureRepository featureRepository;
    private final ProjectRepository projectRepository;
    private final ModelMapper modelMapper;
    private final UserContext userContext;

    private static final Map<FeatureStatus, FeatureStatus> ALLOWED_FEATURE_TRANSITIONS = new EnumMap<>(FeatureStatus.class);
    static {
        ALLOWED_FEATURE_TRANSITIONS.put(FeatureStatus.PLANNED, FeatureStatus.IN_PROGRESS);
        ALLOWED_FEATURE_TRANSITIONS.put(FeatureStatus.IN_PROGRESS, FeatureStatus.DONE);
    }

    @Override
    public Feature assertExists(Long featureId) {
        Feature feature = featureRepository.findById(featureId)
                .orElseThrow(() -> new FeatureNotFoundException(
                        "feature with id:"+ featureId+ "does not exist"
                ));
        return feature;
    }

    /**
     * desc- create feature
     * method - POST
     * payload -
     */
    @Override
    public ApiResponse createFeature(FeatureRequestDTO featureRequestDTO) {

        Project project = projectRepository.findById(featureRequestDTO.getProjectId())
                .orElseThrow(() -> new ProjectNotFoundException(
                        "Project with id "+ featureRequestDTO.getProjectId() + " does not exist"
                ));

        Feature feature = modelMapper.map(featureRequestDTO, Feature.class);

        feature.setCreatedBy(userContext.getUserId());
        feature.setMyProject(project);
        feature.setFeatureStatus(FeatureStatus.PLANNED);

        Feature createdFeature = featureRepository.save(feature);
        return new ApiResponse("success", "feature created successfully with feature id: "+ createdFeature.getId());
    }

    @Override
    public List<FeatureResponseDTO> getAllFeatures(Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(
                        "Project with id "+ projectId + " does not exist"
                ));

        List<Feature> features = featureRepository.findByMyProjectId(projectId);
        List<FeatureResponseDTO> featureResponseDTOList = new ArrayList<>();
        for(Feature feature : features) {
            featureResponseDTOList.add(modelMapper.map(feature, FeatureResponseDTO.class));
        }

        return featureResponseDTOList;
    }

    @Override
    public FeatureResponseDTO getFeatureDetails(Long featureId) {

        Feature feature = this.assertExists(featureId);
        return modelMapper.map(feature, FeatureResponseDTO.class);
    }

    @Override
    public ApiResponse updateFeatureStatus(Long featureId, FeatureStatusUpdateDTO featureStatusUpdateDTO) {

        Feature feature = this.assertExists(featureId);

        FeatureStatus current = feature.getFeatureStatus();
        FeatureStatus target = featureStatusUpdateDTO.getFeatureStatus();

        if(ALLOWED_FEATURE_TRANSITIONS.get(current) != target){
            throw new InvalidFeatureStatusTransitionException(
                    "cannot transition feature from "+ current +" to "+ target
            );
        }

        modelMapper.map(featureStatusUpdateDTO, feature);

        return new ApiResponse("success", "Feature with featureId: "+featureId+" updated successfully");
    }

    @Override
    public ApiResponse deleteFeature(Long featureId) {

        Feature feature = this.assertExists(featureId);

        if(feature.getFeatureStatus() != FeatureStatus.PLANNED) {
            throw new IllegalStateException("Feature with status: "+ feature.getFeatureStatus()+ "cannot be deleted");
        }

        featureRepository.deleteById(featureId);
        return new ApiResponse("success", "Feature with featureId:"+featureId+" deleted successfully");
    }
}
