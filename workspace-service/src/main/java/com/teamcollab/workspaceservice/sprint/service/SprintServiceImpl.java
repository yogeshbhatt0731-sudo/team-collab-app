package com.teamcollab.workspaceservice.sprint.service;

import com.teamcollab.workspaceservice.common.dtos.ApiResponse;
import com.teamcollab.workspaceservice.common.security.UserContext;
import com.teamcollab.workspaceservice.project.entities.Project;
import com.teamcollab.workspaceservice.project.exception.ProjectNotFoundException;
import com.teamcollab.workspaceservice.project.repository.ProjectRepository;
import com.teamcollab.workspaceservice.sprint.dto.SprintRequestDTO;
import com.teamcollab.workspaceservice.sprint.dto.SprintResponseDTO;
import com.teamcollab.workspaceservice.sprint.dto.SprintStatusUpdateDTO;
import com.teamcollab.workspaceservice.sprint.dto.SprintUpdateRequestDTO;
import com.teamcollab.workspaceservice.sprint.entities.Sprint;
import com.teamcollab.workspaceservice.sprint.entities.SprintStatus;
import com.teamcollab.workspaceservice.sprint.exception.InvalidSprintStatusTransitionException;
import com.teamcollab.workspaceservice.sprint.exception.InvalidSprintUpdationException;
import com.teamcollab.workspaceservice.sprint.exception.SprintNotFoundException;
import com.teamcollab.workspaceservice.sprint.repository.SprintRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

import static com.teamcollab.workspaceservice.sprint.entities.SprintStatus.ACTIVE;
import static com.teamcollab.workspaceservice.sprint.entities.SprintStatus.COMPLETED;

@Service
@RequiredArgsConstructor
@Transactional    //readOnly=true
public class SprintServiceImpl implements SprintService {

    private final SprintRepository sprintRepository;
    private final ModelMapper modelMapper;
    private final UserContext userContext;
    private final ProjectRepository projectRepository;

    //planned -> ACTIVE -> completed , i.e no skipping and no going back
    private static final Map<SprintStatus, SprintStatus> ALLOWED_TRANSITIONS = new EnumMap<>(SprintStatus.class);

    static {
        ALLOWED_TRANSITIONS.put(SprintStatus.PLANNED, ACTIVE);
        ALLOWED_TRANSITIONS.put(ACTIVE, SprintStatus.COMPLETED);
    }


    @Override
    public ApiResponse createSprint(SprintRequestDTO sprintRequestDTO) {

        //todo- user-admin validation

        //later to be replaced by project utility reader class to asserts the project existence.
        Project project = projectRepository.findById(sprintRequestDTO.getProjectId())
                .orElseThrow(() -> new ProjectNotFoundException(
                        "Project with id: " + sprintRequestDTO.getProjectId() + " does not exist"));


        //create new sprint entity
        Sprint sprint = modelMapper.map(sprintRequestDTO, Sprint.class);

        //associating sprint with user, here we will get the authenticated and authorized user via cross service call
        sprint.setCreatedBy(userContext.getUserId()); //id set
        sprint.setSprintStatus(SprintStatus.PLANNED);//status initialise
        sprint.setMyProject(project);  //set project with project id (in RequestDTO)


        Sprint createdSprint = sprintRepository.save(sprint);
        return new ApiResponse("success", "sprint created successfully with sprint id " + createdSprint.getId());

    }

    @Override
    public List<SprintResponseDTO> getAllSprints(Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(
                        "Project with id: " + projectId + " does not exist"));

        List<Sprint> sprints = sprintRepository.findByMyProjectId(projectId);
        List<SprintResponseDTO> list = new ArrayList<>();
        for (Sprint sprint : sprints) {
            list.add(modelMapper.map(sprint, SprintResponseDTO.class));
        }

        return list;
    }

    @Override
    public SprintResponseDTO getSprintDetails(Long sprintId) {

        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new SprintNotFoundException(
                        "Sprint with id: " + sprintId + " does not exist"));

        SprintResponseDTO responseDTO = (modelMapper.map(sprint, SprintResponseDTO.class));
        return responseDTO;

    }

    @Override
    public ApiResponse updateSprintStatus(Long sprintId, SprintStatusUpdateDTO sprintStatusUpdateDTO) {
        //todo- admin check

        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new SprintNotFoundException(
                        "Sprint with id: " + sprintId + " does not exist"));
        //sprint - persistent (managed) entity

        //sprint status transitions check
        SprintStatus current = sprint.getSprintStatus();
        SprintStatus target = sprintStatusUpdateDTO.getSprintStatus();

        if (ALLOWED_TRANSITIONS.get(current) != target) {
            throw new InvalidSprintStatusTransitionException(
                    "cannot transition sprint from " + current + " to " + target);
        } else {
            //setting the start date and end date for the sprint as per the status.
            if (target == ACTIVE) {
                sprint.setStartDate(LocalDate.now());
            } else {
                sprint.setEndDate(LocalDate.now());
            }
        }

        //copy the editable fields from the DTO onto the managed entity.
        //mapping config uses condtions.isNotNull(), so null fields in the request are skipped.
        //(partial update safe)
        modelMapper.map(sprintStatusUpdateDTO, sprint);

        //dirty checking flushes the changes at commit
        return new ApiResponse("success", "Sprint with sprintId" + sprintId + "updated successfully");

    }

    @Override
    public ApiResponse updateSprint(Long sprintId, SprintUpdateRequestDTO sprintUpdateRequestDTO) {

        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new SprintNotFoundException(
                        "Sprint with id: " + sprintId + " does not exist"));

        if (!(sprint.getSprintStatus().equals(SprintStatus.PLANNED))) {

            throw new InvalidSprintUpdationException("sprint can not be updated Since it is not in planned state anymore ! ");
        }

            modelMapper.map(sprintUpdateRequestDTO, sprint);
            return new ApiResponse("success", "Sprint with sprintId" + sprintId + "updated successfully");

        }

    @Override
    public ApiResponse deleteSprint(Long sprintId) {

        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new SprintNotFoundException(
                        "Sprint with id: " + sprintId + " does not exist"));

        if (sprint.getSprintStatus() == SprintStatus.ACTIVE) {
            throw new IllegalStateException("Active sprint cannot be deleted.");
        }

        sprintRepository.deleteById(sprintId);
        return new ApiResponse("success", "Sprint with sprintId" + sprintId + "deleted successfully");

    }

}

