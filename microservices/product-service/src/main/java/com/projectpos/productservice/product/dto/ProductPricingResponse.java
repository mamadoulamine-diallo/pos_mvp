package com.projectpos.productservice.product.dto;

import java.math.BigDecimal;

public record ProductPricingResponse(
        Integer productId,
        String productName,
        BigDecimal salePrice,
        BigDecimal purchasePrice
) {
}