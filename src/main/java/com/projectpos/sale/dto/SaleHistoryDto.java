package com.projectpos.sale.dto;

import com.projectpos.user.entity.UserRole;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SaleHistoryDto(
        Integer saleId,
        LocalDateTime saleDate,
        UserRole userRole,
        Long itemCount,
        BigDecimal total
) {
}