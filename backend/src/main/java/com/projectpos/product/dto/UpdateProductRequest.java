package com.projectpos.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateProductRequest(
        @NotBlank
        String name,

        String imageUrl,

        @NotNull
        Integer categoryId,

        @NotNull
        Boolean active
) {
}