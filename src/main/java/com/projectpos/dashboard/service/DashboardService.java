package com.projectpos.dashboard.service;

import com.projectpos.dashboard.dto.*;
import com.projectpos.dashboard.repository.DashboardRepository;
import com.projectpos.shared.utils.FormatUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardService {

    private static final String PERIOD_DAY = "DAY";
    private static final String PERIOD_MONTH = "MONTH";
    private static final String PERIOD_YEAR = "YEAR";

    private final DashboardRepository repository;

    public DashboardService(DashboardRepository repository) {
        this.repository = repository;
    }

    public DashboardSummary getSummary(DashboardPeriod period) {
        LocalDateTime startDate = getStartDate(period);

        BigDecimal revenue = repository.getRevenue(startDate);
        Long salesCount = repository.getSalesCount(startDate);
        Long itemsSold = repository.getItemsSold(startDate);

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

    public List<TopProductDto> getTopProducts(DashboardPeriod period) {
        return repository.findTopProducts(getStartDate(period))
                .stream()
                .limit(5)
                .toList();
    }

    public List<RecentSaleDto> getRecentSales(DashboardPeriod period) {
        return repository.findRecentSales(getStartDate(period))
                .stream()
                .limit(5)
                .toList();
    }

    public List<RevenuePointDto> getRevenueByDay(DashboardPeriod period) {
        return getRevenueByPeriod(period, PERIOD_DAY);
    }

    public List<RevenuePointDto> getRevenueByMonth(DashboardPeriod period) {
        return getRevenueByPeriod(period, PERIOD_MONTH);
    }

    public List<RevenuePointDto> getRevenueByYear(DashboardPeriod period) {
        return getRevenueByPeriod(period, PERIOD_YEAR);
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

    private List<RevenuePointDto> getRevenueByPeriod(DashboardPeriod dashboardPeriod, String revenuePeriod) {
        return mapRevenue(
                repository.findRevenueByPeriodRaw(
                        getStartDate(dashboardPeriod),
                        revenuePeriod
                )
        );
    }

    private LocalDateTime getStartDate(DashboardPeriod period) {
        LocalDateTime now = LocalDateTime.now();

        return switch (period) {
            case TODAY -> now.toLocalDate().atStartOfDay();
            case LAST_7_DAYS -> now.minusDays(7);
            case LAST_30_DAYS -> now.minusDays(30);
            case ALL -> LocalDateTime.of(2000, 1, 1, 0, 0);
        };
    }

    private List<RevenuePointDto> mapRevenue(List<Object[]> rows) {
        return rows.stream()
                .map(row -> new RevenuePointDto(
                        row[0].toString(),
                        ((Number) row[1]).doubleValue()
                ))
                .toList();
    }
}