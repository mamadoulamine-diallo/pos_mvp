package com.projectpos.userservice.controller;

import com.projectpos.userservice.dto.CreateUserRequest;
import com.projectpos.userservice.dto.UpdateUserRequest;
import com.projectpos.userservice.dto.UserResponse;
import com.projectpos.userservice.entity.UserRole;
import com.projectpos.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserApiController {

    private final UserService userService;

    public UserApiController(
            UserService userService
    ) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> findAll() {
        return userService.findAll()
                .stream()
                .map(userService::toResponse)
                .toList();
    }

    @GetMapping("/roles")
    public UserRole[] findRoles() {
        return UserRole.values();
    }

    @PostMapping
    public UserResponse create(
            @Valid
            @RequestBody
            CreateUserRequest request
    ) {
        return userService.toResponse(
                userService.createUser(request)
        );
    }

    @PutMapping("/{id}")
    public UserResponse update(
            @PathVariable Integer id,
            @Valid
            @RequestBody
            UpdateUserRequest request
    ) {
        return userService.toResponse(
                userService.updateUser(
                        id,
                        request
                )
        );
    }
}