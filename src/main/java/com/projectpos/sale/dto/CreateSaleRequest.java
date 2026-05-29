package com.projectpos.sale.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CreateSaleRequest(
        @NotEmpty
        List<@Valid SaleItemRequest> items
) {
}