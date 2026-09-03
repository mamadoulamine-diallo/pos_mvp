// dto/UserResponse.java
package com.projectpos.userservice.dto;

import com.projectpos.userservice.entity.UserRole;

public record UserResponse(
        Integer id,
        String fullName,
        String email,
        UserRole role,
        Boolean active
) {
}