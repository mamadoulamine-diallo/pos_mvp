package com.projectpos.sale.controller;

import com.projectpos.sale.dto.CreateSaleRequest;
import com.projectpos.sale.dto.SaleDetailDto;
import com.projectpos.sale.dto.SaleHistoryDto;
import com.projectpos.sale.entity.Sale;
import com.projectpos.sale.service.SaleService;
import com.projectpos.shared.security.CurrentUserService;
import com.projectpos.user.entity.AppUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
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
    private final CurrentUserService currentUserService;

    public SaleApiController(
            SaleService saleService,
            CurrentUserService currentUserService
    ) {
        this.saleService = saleService;
        this.currentUserService = currentUserService;
    }

    @Operation(
            summary = "Retrieve sales history",
            description = "Returns the sales history with totals, seller and item count."
    )
    @GetMapping
    public List<SaleHistoryDto> findAll() {
        return saleService.getSaleHistory();
    }

    @Operation(
            summary = "Retrieve sale details",
            description = "Returns detailed information for a sale including sold items and totals."
    )
    @GetMapping("/{id}")
    public SaleDetailDto findById(@PathVariable Integer id) {
        return saleService.getSaleDetailDto(id);
    }

    @Operation(
            summary = "Create sale",
            description = "Creates a validated sale, stores sale items and decrements product stock."
    )
    @PostMapping
    public Map<String, Object> create(
            @Valid @RequestBody CreateSaleRequest request,
            HttpSession session
    ) {
        AppUser currentUser = currentUserService.getCurrentUser(session);

        Sale sale = saleService.createSale(request, currentUser);

        return Map.of(
                "saleId", sale.getId(),
                "status", sale.getStatus().name()
        );
    }
}