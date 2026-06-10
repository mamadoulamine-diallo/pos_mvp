package com.projectpos.user.dto;

import com.projectpos.user.entity.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateUserRequest(
        @NotBlank
        String fullName,

        String email,

        @NotBlank
        String pinCode,

        @NotNull
        UserRole role
) {
}