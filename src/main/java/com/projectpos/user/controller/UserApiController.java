package com.projectpos.user.controller;

import com.projectpos.user.dto.CreateUserRequest;
import com.projectpos.user.dto.UpdateUserRequest;
import com.projectpos.user.dto.UserResponse;
import com.projectpos.user.entity.UserRole;
import com.projectpos.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserApiController {

    private final UserService userService;

    public UserApiController(UserService userService) {
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
    public UserResponse create(@Valid @RequestBody CreateUserRequest request) {
        return userService.toResponse(userService.createUser(request));
    }

    @PutMapping("/{id}")
    public UserResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return userService.toResponse(userService.updateUser(id, request));
    }
}