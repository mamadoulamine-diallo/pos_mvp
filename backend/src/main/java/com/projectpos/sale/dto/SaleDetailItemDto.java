package com.projectpos.sale.dto;

import java.math.BigDecimal;

public record SaleDetailItemDto(
        String productName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {
}