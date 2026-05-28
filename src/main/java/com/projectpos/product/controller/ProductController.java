package com.projectpos.product.controller;

import com.projectpos.product.service.ProductService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/products")
    public String listProducts(Model model) {

        model.addAttribute(
                "products",
                service.findAll()
        );

        return "product/list";
    }
}