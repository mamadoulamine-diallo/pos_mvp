package com.projectpos.sale.dto;

import com.projectpos.sale.entity.SaleStatus;
import com.projectpos.user.entity.UserRole;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record SaleDetailDto(
        Integer saleId,
        LocalDateTime saleDate,
        SaleStatus status,
        UserRole userRole,
        Long itemCount,
        BigDecimal total,
        List<SaleDetailItemDto> items
) {
}