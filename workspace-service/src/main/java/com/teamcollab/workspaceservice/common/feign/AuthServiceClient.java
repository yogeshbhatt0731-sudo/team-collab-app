package com.teamcollab.workspaceservice.common.feign;

import com.teamcollab.workspaceservice.common.dtos.UserDetailsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
        name = "auth-service"
)
public interface AuthServiceClient {

    @GetMapping("/auth/users")
    List<UserDetailsDTO> getUsersById(@RequestParam(name = "ids") List<Long> ids);

    @GetMapping("/auth/users/email")
    UserDetailsDTO getUserByEmail(@RequestParam(name = "email") String email);
}
