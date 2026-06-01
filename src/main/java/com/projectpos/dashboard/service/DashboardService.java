package com.projectpos.dashboard.service;

import com.projectpos.dashboard.dto.DashboardSummary;
import com.projectpos.dashboard.dto.TopProductDto;
import com.projectpos.dashboard.repository.DashboardRepository;
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
                averageBasket
        );
    }

    public List<TopProductDto> getTopProducts() {
        return repository.findTopProducts()
                .stream()
                .limit(5)
                .toList();
    }
}