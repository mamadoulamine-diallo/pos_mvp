package com.projectpos.userservice.controller;

import com.projectpos.userservice.dto.LoginRequest;
import com.projectpos.userservice.dto.UserResponse;
import com.projectpos.userservice.entity.AppUser;
import com.projectpos.userservice.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthApiController {

    private final UserService userService;

    public AuthApiController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public UserResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpSession session
    ) {
        AppUser user;

        try {
            user = userService.authenticate(request.pinCode());
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    exception.getMessage()
            );
        }

        session.setAttribute("currentUser", user);

        return userService.toResponse(user);
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(
            HttpSession session
    ) {
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

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpSession session) {
        session.invalidate();
    }
}