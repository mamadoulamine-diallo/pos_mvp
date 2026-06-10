package com.projectpos.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateCategoryRequest(
        @NotBlank
        String name,

        @NotNull
        Boolean active
) {
}