package com.projectpos.dashboard.service;

import com.projectpos.dashboard.dto.*;
import com.projectpos.dashboard.repository.DashboardRepository;
import com.projectpos.shared.utils.FormatUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class DashboardService {

    private final DashboardRepository repository;

    public DashboardService(DashboardRepository repository) {
        this.repository = repository;
    }

    public DashboardSummary getSummary() {
        BigDecimal revenue = repository.getRevenue();
        Long salesCount = repository.getSalesCount();
        Long itemsSold = repository.getItemsSold();

        BigDecimal averageBasket = BigDecimal.ZERO;

        if (salesCount > 0) {
            averageBasket = revenue.divide(
                    BigDecimal.valueOf(salesCount),
                    2,
                    RoundingMode.HALF_UP
            );
        }

        return new DashboardSummary(
                revenue,
                salesCount,
                itemsSold,
                averageBasket,
                FormatUtils.formatCurrency(revenue),
                FormatUtils.formatCurrency(averageBasket)
        );
    }

    public List<TopProductDto> getTopProducts() {
        return repository.findTopProducts()
                .stream()
                .limit(5)
                .toList();
    }

    public List<RevenuePointDto> getRevenueByDay() {
        return repository.findRevenueByDayRaw()
                .stream()
                .map(row -> new RevenuePointDto(
                        row[0].toString(),
                        ((Number) row[1]).doubleValue()
                ))
                .toList();
    }

    public List<RecentSaleDto> getRecentSales() {
        return repository.findRecentSales()
                .stream()
                .limit(5)
                .toList();
    }

    public List<RevenuePointDto> getRevenueByYear() {
        return repository.findRevenueByYearRaw()
                .stream()
                .map(row -> new RevenuePointDto(
                        row[0].toString(),
                        ((Number) row[1]).doubleValue()
                ))
                .toList();
    }

    public List<RevenuePointDto> getRevenueByMonth() {
        return repository.findRevenueByMonthRaw()
                .stream()
                .map(row -> new RevenuePointDto(
                        row[0].toString(),
                        ((Number) row[1]).doubleValue()
                ))
                .toList();
    }

    public List<StockAlertDto> getStockAlerts() {
        return repository.findStockAlerts();
    }

    public long getLowStockCount() {
        return repository.findStockAlerts()
                .stream()
                .filter(alert -> alert.stockQuantity() > 0)
                .count();
    }

    public long getOutOfStockCount() {
        return repository.findStockAlerts()
                .stream()
                .filter(alert -> alert.stockQuantity() == 0)
                .count();
    }
}