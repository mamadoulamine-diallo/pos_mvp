package com.projectpos.product.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductPriceHistoryResponse(
        BigDecimal salePrice,
        BigDecimal purchasePrice,
        LocalDateTime startDate,
        LocalDateTime endDate
) {
}