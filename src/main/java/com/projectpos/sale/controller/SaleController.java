package com.projectpos.sale.controller;

import com.projectpos.product.service.ProductService;
import com.projectpos.sale.service.SaleService;
import com.projectpos.user.entity.AppUser;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.projectpos.sale.dto.CreateSaleRequest;
import com.projectpos.sale.entity.Sale;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

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
    public Map<String, Object> createSale(
            @Valid @RequestBody CreateSaleRequest request,
            HttpSession session
    ) {
        AppUser currentUser =
                (AppUser) session.getAttribute("currentUser");

        if (currentUser == null) {
            throw new IllegalArgumentException("Utilisateur non connecté");
        }

        Sale sale = service.createSale(request, currentUser);

        return Map.of(
                "saleId", sale.getId(),
                "status", sale.getStatus().name()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleIllegalArgument(
            IllegalArgumentException exception
    ) {
        return Map.of(
                "error", exception.getMessage()
        );
    }
}