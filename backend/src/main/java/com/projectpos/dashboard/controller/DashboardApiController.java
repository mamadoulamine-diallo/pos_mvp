package com.projectpos.dashboard.controller;

import com.projectpos.dashboard.dto.*;
import com.projectpos.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
        name = "Dashboard",
        description = "Business analytics and reporting"
)
@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardApiController {

    private final DashboardService dashboardService;

    public DashboardApiController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @Operation(
            summary = "Retrieve dashboard summary",
            description = "Returns main business KPIs for the selected period."
    )
    @GetMapping("/summary")
    public DashboardSummary getSummary(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period
    ) {
        return dashboardService.getSummary(period);
    }

    @Operation(
            summary = "Retrieve top products",
            description = "Returns the best-selling products for the selected period."
    )
    @GetMapping("/top-products")
    public List<TopProductDto> getTopProducts(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period
    ) {
        return dashboardService.getTopProducts(period);
    }

    @Operation(
            summary = "Retrieve recent sales",
            description = "Returns the most recent sales for the selected period."
    )
    @GetMapping("/recent-sales")
    public List<RecentSaleDto> getRecentSales(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period
    ) {
        return dashboardService.getRecentSales(period);
    }

    @Operation(
            summary = "Retrieve daily revenue",
            description = "Returns revenue grouped by day for the selected period."
    )
    @GetMapping("/revenue/day")
    public List<RevenuePointDto> getRevenueByDay(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period
    ) {
        return dashboardService.getRevenueByDay(period);
    }

    @Operation(
            summary = "Retrieve monthly revenue",
            description = "Returns revenue grouped by month for the selected period."
    )
    @GetMapping("/revenue/month")
    public List<RevenuePointDto> getRevenueByMonth(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period
    ) {
        return dashboardService.getRevenueByMonth(period);
    }

    @Operation(
            summary = "Retrieve yearly revenue",
            description = "Returns revenue grouped by year for the selected period."
    )
    @GetMapping("/revenue/year")
    public List<RevenuePointDto> getRevenueByYear(
            @RequestParam(defaultValue = "TODAY") DashboardPeriod period
    ) {
        return dashboardService.getRevenueByYear(period);
    }

    @Operation(
            summary = "Retrieve stock alerts",
            description = "Returns products with low stock or out-of-stock status."
    )
    @GetMapping("/stock-alerts")
    public List<StockAlertDto> getStockAlerts() {
        return dashboardService.getStockAlerts();
    }

    @Operation(
            summary = "Retrieve low stock count",
            description = "Returns the number of products with low stock but not out of stock."
    )
    @GetMapping("/stock-alerts/low-count")
    public long getLowStockCount() {
        return dashboardService.getLowStockCount();
    }

    @Operation(
            summary = "Retrieve out-of-stock count",
            description = "Returns the number of products currently out of stock."
    )
    @GetMapping("/stock-alerts/out-count")
    public long getOutOfStockCount() {
        return dashboardService.getOutOfStockCount();
    }
}