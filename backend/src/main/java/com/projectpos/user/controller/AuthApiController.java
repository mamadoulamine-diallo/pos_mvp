package com.projectpos.user.controller;

import com.projectpos.user.dto.LoginRequest;
import com.projectpos.user.dto.UserResponse;
import com.projectpos.user.entity.AppUser;
import com.projectpos.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Tag(
        name = "Authentication",
        description = "Current authenticated user management"
)
@RestController
@RequestMapping("/api/v1/auth")
public class AuthApiController {

    private final UserService userService;

    public AuthApiController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "Authenticate user",
            description = "Authenticates an active user with a PIN code and stores the user in the HTTP session."
    )
    @PostMapping("/login")
    public UserResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpSession session
    ) {
        try {
            AppUser user = userService.authenticate(request.pinCode());

            session.setAttribute("currentUser", user);

            return userService.toResponse(user);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    exception.getMessage()
            );
        }
    }

    @Operation(
            summary = "Retrieve current user",
            description = "Returns the user currently stored in the HTTP session."
    )
    @GetMapping("/me")
    public UserResponse getCurrentUser(HttpSession session) {
        AppUser currentUser =
                (AppUser) session.getAttribute("currentUser");

        if (currentUser == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Aucun utilisateur connecté"
            );
        }

        return userService.toResponse(currentUser);
    }

    @Operation(
            summary = "Logout current user",
            description = "Invalidates the current HTTP session."
    )
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpSession session) {
        session.invalidate();
    }
}