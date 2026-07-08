package com.projectpos.user.controller;

import com.projectpos.user.dto.CreateUserRequest;
import com.projectpos.user.dto.UpdateUserRequest;
import com.projectpos.user.dto.UserResponse;
import com.projectpos.user.entity.UserRole;
import com.projectpos.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
        name = "Users",
        description = "Application users management"
)
@RestController
@RequestMapping("/api/v1/users")
public class UserApiController {

    private final UserService userService;

    public UserApiController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "Retrieve all users",
            description = "Returns all application users without exposing PIN codes."
    )
    @GetMapping
    public List<UserResponse> findAll() {
        return userService.findAll()
                .stream()
                .map(userService::toResponse)
                .toList();
    }

    @Operation(
            summary = "Retrieve available roles",
            description = "Returns the list of available user roles."
    )
    @GetMapping("/roles")
    public UserRole[] findRoles() {
        return UserRole.values();
    }

    @Operation(
            summary = "Create user",
            description = "Creates a new application user with a unique PIN code."
    )
    @PostMapping
    public UserResponse create(@Valid @RequestBody CreateUserRequest request) {
        return userService.toResponse(userService.createUser(request));
    }

    @Operation(
            summary = "Update user",
            description = "Updates user information, role, PIN code and active status."
    )
    @PutMapping("/{id}")
    public UserResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return userService.toResponse(userService.updateUser(id, request));
    }
}