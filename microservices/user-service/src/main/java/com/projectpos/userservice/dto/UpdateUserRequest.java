// dto/UpdateUserRequest.java
package com.projectpos.userservice.dto;

import com.projectpos.userservice.entity.UserRole;
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