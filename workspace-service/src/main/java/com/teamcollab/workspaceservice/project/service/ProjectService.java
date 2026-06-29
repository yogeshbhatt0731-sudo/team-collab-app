package com.teamcollab.workspaceservice.project.service;


import com.teamcollab.workspaceservice.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ProjectService implements ProjectReader {
    private final ProjectRepository projectRepository;

    @Override
    public void assertExists(Long id) {
        
    }
}
