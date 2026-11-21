package com.projectpos.dashboard.dto;

import java.math.BigDecimal;

public record RevenuePointDto(
        String label,
        Double revenue
) {
}