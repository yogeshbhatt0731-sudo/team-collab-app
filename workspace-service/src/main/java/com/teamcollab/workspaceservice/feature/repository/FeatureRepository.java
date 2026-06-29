package com.teamcollab.workspaceservice.feature.repository;

import com.teamcollab.workspaceservice.feature.entities.Feature;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeatureRepository extends JpaRepository<Feature,Long> {

}
