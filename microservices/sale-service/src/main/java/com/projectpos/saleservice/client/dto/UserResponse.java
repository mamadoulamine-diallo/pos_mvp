package com.projectpos.saleservice.client.dto;

public record UserResponse(
        Integer id,
        String fullName,
        String email,
        String role,
        Boolean active
) {
}