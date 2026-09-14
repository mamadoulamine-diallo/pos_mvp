package com.projectpos.saleservice.client.dto;

public record CurrentUserResponse(
        Integer id,
        String fullName,
        String role
) {
}