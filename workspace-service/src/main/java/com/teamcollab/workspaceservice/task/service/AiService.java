package com.teamcollab.workspaceservice.task.service;

import com.teamcollab.workspaceservice.task.dto.AiIndexRequestDTO;
import com.teamcollab.workspaceservice.task.dto.AiSearchResponseDTO;
import com.teamcollab.workspaceservice.task.dto.SmartSearchResponseDTO;
import com.teamcollab.workspaceservice.task.dto.TaskResponseDTO;
import com.teamcollab.workspaceservice.task.entities.Task;
import com.teamcollab.workspaceservice.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {
    private final RestTemplate restTemplate;
    private final TaskRepository taskRepository;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public SmartSearchResponseDTO smartSearch(String query, int nResults) {
        String url = aiServiceUrl + "/search?query={query}&n_results={nResults}";
        AiSearchResponseDTO aiResponse = restTemplate.getForObject(url, AiSearchResponseDTO.class, query, nResults);

        if (aiResponse == null || aiResponse.getTask_ids() == null || aiResponse.getTask_ids().isEmpty()) {
            return new SmartSearchResponseDTO("No tasks found matching your query.", Collections.emptyList());
        }

        List<Long> taskIds = aiResponse.getTask_ids().stream().map(Integer::longValue).toList();
        List<TaskResponseDTO> tasks = taskRepository.findTasksByIds(taskIds);

        return new SmartSearchResponseDTO(aiResponse.getSummary(), tasks);
    }

    public void indexTask(Task task) {
        try {
            String url = aiServiceUrl + "/index";
            AiIndexRequestDTO request = new AiIndexRequestDTO(task.getId(), task.getTitle(), task.getDescription());
            restTemplate.postForObject(url, request, Object.class);
            log.info("Indexed task {} in ai-service", task.getId());
        } catch (Exception e) {
            log.warn("Failed to index task {} in ai-service: {}", task.getId(), e.getMessage());
        }
    }

    public void deleteIndex(Long taskId) {
        try {
            String url = aiServiceUrl + "/index/{taskId}";
            restTemplate.delete(url, taskId);
            log.info("Deleted index for task {} from ai-service", taskId);
        } catch (Exception e) {
            log.warn("Failed to delete index for task {} from ai-service: {}", taskId, e.getMessage());
        }
    }
}
