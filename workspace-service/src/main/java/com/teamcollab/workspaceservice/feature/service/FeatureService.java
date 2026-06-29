package com.teamcollab.workspaceservice.feature.service;

import com.teamcollab.workspaceservice.feature.repository.FeatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class FeatureService {
    private final FeatureRepository featureRepository;
}
