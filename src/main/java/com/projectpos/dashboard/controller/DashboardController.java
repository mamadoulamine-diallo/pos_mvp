package com.projectpos.dashboard.controller;

import com.projectpos.dashboard.service.DashboardService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping("/")
    public String dashboard(Model model) {

        model.addAttribute(
                "summary",
                service.getSummary()
        );

        return "dashboard/index";
    }
}