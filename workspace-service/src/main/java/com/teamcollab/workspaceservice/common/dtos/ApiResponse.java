package com.teamcollab.workspaceservice.common.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ApiResponse {
   private String status;
   private LocalDateTime timestamp;
   private String message;

   public ApiResponse(String status,String message ) {
       this.status = status;
       this.message = message;
       timestamp = LocalDateTime.now();
    }
}
