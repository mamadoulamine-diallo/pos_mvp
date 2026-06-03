package com.projectpos.user.controller;

import com.projectpos.user.entity.AppUser;
import com.projectpos.user.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthController {

    private final UserService service;

    public AuthController(UserService service) {
        this.service = service;
    }

    @GetMapping("/login")
    public String loginPage() {
        return "auth/login";
    }

    @PostMapping("/login")
    public String login(
            @RequestParam String pinCode,
            HttpSession session
    ) {

        AppUser user =
                service.authenticate(pinCode);

        session.setAttribute(
                "currentUser",
                user
        );

        return "redirect:/";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();

        return "redirect:/login";
    }
}