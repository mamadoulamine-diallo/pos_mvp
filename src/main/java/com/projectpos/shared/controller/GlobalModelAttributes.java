package com.projectpos.shared.controller;

import com.projectpos.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalModelAttributes {

    private final DashboardService dashboardService;

    public GlobalModelAttributes(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @ModelAttribute("globalStockAlerts")
    public Object globalStockAlerts() {
        return dashboardService.getStockAlerts();
    }

    @ModelAttribute("globalLowStockCount")
    public long globalLowStockCount() {
        return dashboardService.getLowStockCount();
    }

    @ModelAttribute("globalOutOfStockCount")
    public long globalOutOfStockCount() {
        return dashboardService.getOutOfStockCount();
    }

    @ModelAttribute("globalNotificationCount")
    public long globalNotificationCount() {
        return dashboardService.getLowStockCount()
                + dashboardService.getOutOfStockCount();
    }
}