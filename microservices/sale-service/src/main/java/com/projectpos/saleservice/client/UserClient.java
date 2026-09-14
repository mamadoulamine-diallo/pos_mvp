package com.projectpos.saleservice.client;

import com.projectpos.saleservice.client.dto.CurrentUserResponse;
import com.projectpos.saleservice.client.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/api/v1/auth/me")
    CurrentUserResponse getCurrentUser(
            @RequestHeader("Cookie") String cookie
    );

    @GetMapping("/api/v1/users/{id}")
    UserResponse findById(
            @PathVariable("id") Integer id
    );
}