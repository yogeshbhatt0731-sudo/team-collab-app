package com.teamcollab.workspaceservice.feature.controller;


import com.teamcollab.workspaceservice.feature.dto.FeatureRequestDTO;
import com.teamcollab.workspaceservice.feature.dto.FeatureStatusUpdateDTO;
import com.teamcollab.workspaceservice.feature.service.FeatureService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping
public class FeatureController {

    private final FeatureService featureService;

    @PostMapping("/feature")
    public ResponseEntity<?> createFeature(@Valid  @RequestBody FeatureRequestDTO featureRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(featureService.createFeature(featureRequestDTO));
    }

    @GetMapping("/projects/{projectId}/feature")
    public ResponseEntity<?> getAllFeatures(@PathVariable Long projectId){
        return  ResponseEntity.ok(featureService.getAllFeatures(projectId));
    }

    @GetMapping("/feature/{featureId}")
    public ResponseEntity<?> getFeatureDetails(@PathVariable Long featureId){
        return ResponseEntity.ok(featureService.getFeatureDetails(featureId));
    }

    @PatchMapping("/feature/{featureId}/status")
    public ResponseEntity <?> updateSprintStatus (@PathVariable Long featureId ,
                                                  @RequestBody FeatureStatusUpdateDTO featureStatusUpdateDTO){
        return ResponseEntity.ok(featureService.updateFeatureStatus(featureId,featureStatusUpdateDTO));
    }

    @DeleteMapping("feature/{featureId}")
    public ResponseEntity<?> deleteFeature(@PathVariable Long featureId) {
        return ResponseEntity.ok(featureService.deleteFeature(featureId));
    }

}
