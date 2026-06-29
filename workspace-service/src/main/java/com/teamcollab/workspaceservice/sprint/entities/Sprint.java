package com.teamcollab.workspaceservice.sprint.entities;

import com.teamcollab.workspaceservice.common.entity.BaseEntity;
import com.teamcollab.workspaceservice.project.entities.Project;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "sprint")
@AttributeOverride(name = "id",column = @Column(name = "sprint_id"))
@AttributeOverride(name = "createdAt",column = @Column(name = "created_at"))
public class Sprint extends BaseEntity {
    // User 1 ---> * Sprint , cross microservice association
    @Column(name = "created_by", nullable = false, updatable = false)
    private Long createdBy;

    // Project 1 ---> * Sprint
    @ManyToOne
    @JoinColumn(name = "project_id",nullable = false)
    private Project myProject;

    @Column(nullable = false)
    private String name;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(columnDefinition = "TEXT")
    private String goal;

    @Column(name = "status",nullable = false)
    @Enumerated(EnumType.STRING)
    private SprintStatus sprintStatus;


}
