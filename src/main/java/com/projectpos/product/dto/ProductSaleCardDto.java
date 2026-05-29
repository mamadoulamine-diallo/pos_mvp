package com.projectpos.product.dto;

import java.math.BigDecimal;

public record ProductSaleCardDto(
        Integer id,
        String name,
        String imageUrl,
        BigDecimal activePrice,
        String categoryName
) {
}