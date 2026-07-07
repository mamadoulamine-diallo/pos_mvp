package com.projectpos.category.dto;

public record CategoryResponse(
        Integer id,
        String name,
        Boolean active
) {
}