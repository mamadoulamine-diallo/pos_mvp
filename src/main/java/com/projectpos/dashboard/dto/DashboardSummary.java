package com.projectpos.dashboard.dto;

import java.math.BigDecimal;

public record DashboardSummary(
        BigDecimal revenue,
        Long salesCount,
        Long itemsSold,
        BigDecimal averageBasket
) {
}