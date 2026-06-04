package com.projectpos.product.controller;

import com.projectpos.product.dto.CreateProductRequest;
import com.projectpos.product.entity.Product;
import com.projectpos.product.service.ProductPriceService;
import com.projectpos.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
public class ProductController {

    private final ProductService service;
    private final ProductPriceService priceService;

    public ProductController(ProductService service, ProductPriceService priceService) {
        this.service = service;
        this.priceService = priceService;
    }

    @GetMapping("/products")
    public String listProducts(Model model) {
        model.addAttribute("products", service.findAll());
        model.addAttribute("priceService", priceService);

        return "product/list";
    }

    @PostMapping("/products")
    @ResponseBody
    public Map<String, Object> createProduct(@Valid @RequestBody CreateProductRequest request) {
        Product product = service.createProduct(request);

        return Map.of(
                "productId", product.getId(),
                "name", product.getName()
        );
    }
}