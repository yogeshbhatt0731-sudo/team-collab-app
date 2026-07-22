package com.teamcollab.workspaceservice.sprint.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SprintUpdateRequestDTO {

    private String goal;
    private String name;

}
