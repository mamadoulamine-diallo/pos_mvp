package com.projectpos.dashboard.dto;

import java.math.BigDecimal;

public record TopProductDto(
        String productName,
        Long quantitySold,
        Long revenue
) {
}