package com.projectpos.sale.controller;

import com.projectpos.sale.dto.SaleDetailDto;
import com.projectpos.sale.dto.SaleHistoryDto;
import com.projectpos.sale.service.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleApiController {

    private final SaleService saleService;

    public SaleApiController(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping
    public List<SaleHistoryDto> findAll() {
        return saleService.getSaleHistory();
    }

    @GetMapping("/{id}")
    public SaleDetailDto findById(@PathVariable Integer id) {
        return saleService.getSaleDetailDto(id);
    }
}