package com.projectpos.product.controller;

import com.projectpos.product.service.ProductPriceService;
import com.projectpos.product.service.ProductService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProductController {

    private final ProductService service;
    private final ProductPriceService priceService;

    public ProductController(
            ProductService service,
            ProductPriceService priceService
    ) {
        this.service = service;
        this.priceService = priceService;
    }

    @GetMapping("/products")
    public String listProducts(Model model) {

        model.addAttribute(
                "products",
                service.findAll()
        );

        model.addAttribute(
                "priceService",
                priceService
        );

        return "product/list";
    }
}