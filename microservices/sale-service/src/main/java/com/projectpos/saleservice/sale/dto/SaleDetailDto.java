package com.projectpos.saleservice.sale.dto;

import com.projectpos.saleservice.sale.entity.SaleStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record SaleDetailDto(
        Integer saleId,
        String userName,
        LocalDateTime saleDate,
        SaleStatus status,
        String userRole,
        Long itemCount,
        BigDecimal total,
        List<SaleDetailItemDto> items
) {
}