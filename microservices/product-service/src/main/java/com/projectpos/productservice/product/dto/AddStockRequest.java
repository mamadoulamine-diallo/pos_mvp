package com.projectpos.productservice.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AddStockRequest(

        @NotNull
        Integer productId,

        @NotNull
        @Min(1)
        Integer quantity

) {
}