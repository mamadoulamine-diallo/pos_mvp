package com.projectpos.saleservice.sale.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SaleHistoryDto(
        Integer saleId,
        LocalDateTime saleDate,
        String userName,
        String userRole,
        Long itemCount,
        BigDecimal total
) {
}