package com.projectpos.dashboard.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RecentSaleDto(
        Integer saleId,
        LocalDateTime saleDate,
        BigDecimal total
) {
}