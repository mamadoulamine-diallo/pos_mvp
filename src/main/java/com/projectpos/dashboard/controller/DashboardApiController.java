package com.projectpos.dashboard.controller;

import com.projectpos.dashboard.dto.*;
import com.projectpos.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardApiController {

    private final DashboardService dashboardService;

    public DashboardApiController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummary getSummary(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period
    ) {
        return dashboardService.getSummary(period);
    }

    @GetMapping("/top-products")
    public List<TopProductDto> getTopProducts(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period
    ) {
        return dashboardService.getTopProducts(period);
    }

    @GetMapping("/recent-sales")
    public List<RecentSaleDto> getRecentSales(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period
    ) {
        return dashboardService.getRecentSales(period);
    }

    @GetMapping("/revenue/day")
    public List<RevenuePointDto> getRevenueByDay(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period
    ) {
        return dashboardService.getRevenueByDay(period);
    }

    @GetMapping("/revenue/month")
    public List<RevenuePointDto> getRevenueByMonth(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period
    ) {
        return dashboardService.getRevenueByMonth(period);
    }

    @GetMapping("/revenue/year")
    public List<RevenuePointDto> getRevenueByYear(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period
    ) {
        return dashboardService.getRevenueByYear(period);
    }

    @GetMapping("/stock-alerts")
    public List<StockAlertDto> getStockAlerts() {
        return dashboardService.getStockAlerts();
    }

    @GetMapping("/stock-alerts/low-count")
    public long getLowStockCount() {
        return dashboardService.getLowStockCount();
    }

    @GetMapping("/stock-alerts/out-count")
    public long getOutOfStockCount() {
        return dashboardService.getOutOfStockCount();
    }
}