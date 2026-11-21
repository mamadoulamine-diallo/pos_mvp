package com.projectpos.user.dto;

import com.projectpos.user.entity.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRequest(
        @NotBlank
        String fullName,

        String email,

        @NotBlank
        String pinCode,

        @NotNull
        UserRole role,

        @NotNull
        Boolean active
) {
}