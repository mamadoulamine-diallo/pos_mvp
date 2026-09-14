package com.projectpos.saleservice.sale.controller;

import com.projectpos.saleservice.client.UserClient;
import com.projectpos.saleservice.client.dto.CurrentUserResponse;
import com.projectpos.saleservice.sale.dto.CreateSaleRequest;
import com.projectpos.saleservice.sale.dto.SaleHistoryDto;
import com.projectpos.saleservice.sale.dto.SaleDetailDto;
import com.projectpos.saleservice.sale.entity.Sale;
import com.projectpos.saleservice.sale.service.SaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(
        name = "Sales",
        description = "Sales management"
)
@RestController
@RequestMapping("/api/v1/sales")
public class SaleApiController {

    private final SaleService saleService;
    private final UserClient userClient;

    public SaleApiController(
            SaleService saleService,
            UserClient userClient
    ) {
        this.saleService = saleService;
        this.userClient = userClient;
    }

    @Operation(summary = "Get sale history")
    @GetMapping
    public List<SaleHistoryDto> findAll() {
        return saleService.getSaleHistory();
    }

    @Operation(summary = "Get sale details")
    @GetMapping("/{id}")
    public SaleDetailDto findById(
            @PathVariable Integer id
    ) {
        return saleService.getSaleDetailDto(id);
    }

    @Operation(
            summary = "Create sale",
            description = "Creates a validated sale, stores sale items and decrements product stock."
    )
    @PostMapping
    public Map<String, Object> create(
            @Valid @RequestBody CreateSaleRequest request,
            @RequestHeader("Cookie") String cookie
    ) {
        CurrentUserResponse currentUser =
                userClient.getCurrentUser(cookie);

        Sale sale = saleService.createSale(
                request,
                currentUser.id()
        );

        return Map.of(
                "saleId", sale.getId(),
                "status", sale.getStatus().name()
        );
    }
}