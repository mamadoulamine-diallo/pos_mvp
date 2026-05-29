package com.projectpos.sale.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SaleItemRequest(
        @NotNull
        Integer productId,

        @NotNull
        @Min(1)
        Integer quantity
) {
}