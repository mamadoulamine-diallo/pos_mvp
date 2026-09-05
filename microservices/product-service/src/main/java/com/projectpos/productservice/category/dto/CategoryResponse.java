package com.projectpos.productservice.category.dto;

public record CategoryResponse(
        Integer id,
        String name,
        Boolean active
) {
}