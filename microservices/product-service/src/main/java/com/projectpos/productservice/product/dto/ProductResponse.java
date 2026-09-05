package com.projectpos.productservice.product.dto;

import java.math.BigDecimal;

public record ProductResponse(
        Integer id,
        String name,
        String imageUrl,
        Boolean active,
        Integer stockQuantity,
        Integer categoryId,
        String categoryName,
        BigDecimal salePrice
) {
}