package com.projectpos.user.controller;

import com.projectpos.user.dto.CreateUserRequest;
import com.projectpos.user.dto.UpdateUserRequest;
import com.projectpos.user.entity.AppUser;
import com.projectpos.user.entity.UserRole;
import com.projectpos.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/users")
    public String usersPage(HttpSession session, Model model) {
        AppUser currentUser = (AppUser) session.getAttribute("currentUser");

        if (currentUser == null) {
            return "redirect:/login";
        }

        model.addAttribute("currentUser", currentUser);
        model.addAttribute("users", service.findAll());
        model.addAttribute("roles", UserRole.values());

        return "user/list";
    }

    @PostMapping("/users")
    @ResponseBody
    public Map<String, Object> createUser(@Valid @RequestBody CreateUserRequest request) {
        AppUser user = service.createUser(request);

        return Map.of(
                "userId", user.getId(),
                "fullName", user.getFullName()
        );
    }

    @PutMapping("/users/{id}")
    @ResponseBody
    public Map<String, Object> updateUser(@PathVariable Integer id, @Valid @RequestBody UpdateUserRequest request) {
        AppUser user = service.updateUser(id, request);

        return Map.of(
                "userId", user.getId(),
                "fullName", user.getFullName(),
                "active", user.getActive()
        );
    }
}