package com.teamcollab.workspaceservice.sprint.service;

import com.teamcollab.workspaceservice.sprint.exception.SprintNotFoundException;
import com.teamcollab.workspaceservice.sprint.repository.SprintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SprintService implements SprintReader {
    private final SprintRepository sprintRepository;

    @Override
    public void assertExists(Long id) {
        if (!sprintRepository.existsById(id)) throw new SprintNotFoundException("Sprint with id "+ id + "Not found");
    }
}
