package com.projectpos.user.controller;

import com.projectpos.user.entity.AppUser;
import com.projectpos.user.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UserController {
    private UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/test-user")
    @ResponseBody
    public String test() {

        AppUser user =
                userService.authenticate("1234");

        return user.getRole().name();
    }
}
