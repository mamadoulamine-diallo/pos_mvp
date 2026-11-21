package com.projectpos.user.dto;

import com.projectpos.user.entity.UserRole;

public record UserResponse(
        Integer id,
        String fullName,
        String email,
        UserRole role,
        Boolean active
) {
}