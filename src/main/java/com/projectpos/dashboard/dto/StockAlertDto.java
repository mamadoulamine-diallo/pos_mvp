package com.projectpos.dashboard.dto;

public record StockAlertDto(
        Integer productId,
        String productName,
        Integer stockQuantity,
        String status
) {
}