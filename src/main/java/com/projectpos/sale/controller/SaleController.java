package com.projectpos.sale.controller;

import com.projectpos.product.service.ProductService;
import com.projectpos.sale.service.SaleService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.projectpos.sale.dto.CreateSaleRequest;
import com.projectpos.sale.entity.Sale;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
public class SaleController {

    private final SaleService service;
    private final ProductService productService;

    public SaleController(
            SaleService service,
            ProductService productService
    ) {
        this.service = service;
        this.productService = productService;
    }

    @GetMapping("/sales")
    public String listSales(Model model) {
        model.addAttribute("sales", service.findAll());
        return "sale/list";
    }

    @GetMapping("/sales/new")
    public String newSale(Model model) {
        model.addAttribute("products", productService.findAllForSale());
        return "sale/new-sale";
    }

    @PostMapping("/sales")
    @ResponseBody
    public Map<String, Object> createSale(@Valid @RequestBody CreateSaleRequest request) {
        Sale sale = service.createSale(request);

        return Map.of(
                "saleId", sale.getId(),
                "status", sale.getStatus().name()
        );
    }
}