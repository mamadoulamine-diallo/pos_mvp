package com.projectpos.saleservice.client.dto;

public record RemoveStockRequest(
        Integer productId,
        Integer quantity
) {
}