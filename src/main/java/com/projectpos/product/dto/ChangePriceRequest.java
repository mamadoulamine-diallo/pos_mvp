package com.projectpos.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ChangePriceRequest(

        @NotNull
        Integer productId,

        @NotNull
        @DecimalMin("0.01")
        BigDecimal salePrice,

        @NotNull
        @DecimalMin("0.01")
        BigDecimal purchasePrice

) {
}