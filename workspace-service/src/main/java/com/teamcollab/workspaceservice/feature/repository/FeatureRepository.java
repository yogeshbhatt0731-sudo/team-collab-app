package com.teamcollab.workspaceservice.feature.repository;

import com.teamcollab.workspaceservice.feature.entities.Feature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeatureRepository extends JpaRepository<Feature,Long> {
    List<Feature> findByMyProjectId(Long projectId);
}
