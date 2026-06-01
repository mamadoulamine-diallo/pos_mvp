package com.projectpos.dashboard.controller;

import com.projectpos.dashboard.dto.DashboardPeriod;
import com.projectpos.dashboard.service.DashboardService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping("/")
    public String dashboard(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period,
            Model model
    ){
        model.addAttribute("summary", service.getSummary(period));
        model.addAttribute("selectedPeriod", period);
        model.addAttribute("topProducts", service.getTopProducts());
        model.addAttribute("revenueByDay", service.getRevenueByDay());
        model.addAttribute("recentSales", service.getRecentSales());
        model.addAttribute("revenueByYear", service.getRevenueByYear());
        model.addAttribute("revenueByMonth", service.getRevenueByMonth());
        model.addAttribute("stockAlerts", service.getStockAlerts());
        model.addAttribute("lowStockCount", service.getLowStockCount());
        model.addAttribute("outOfStockCount", service.getOutOfStockCount());

        return "dashboard/index";
    }
}