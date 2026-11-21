package com.projectpos.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateProductRequest(
        @NotBlank
        String name,

        String imageUrl,

        @NotNull
        Integer categoryId,

        @NotNull
        @Min(0)
        Integer stockQuantity,

        @NotNull
        @DecimalMin("0.0")
        BigDecimal salePrice,

        @NotNull
        @DecimalMin("0.0")
        BigDecimal purchasePrice
) {
}