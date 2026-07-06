package com.projectpos.product.controller;

import com.projectpos.product.dto.CreateProductRequest;
import com.projectpos.product.dto.ProductResponse;
import com.projectpos.product.dto.UpdateProductRequest;
import com.projectpos.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductApiController {

    private final ProductService productService;

    public ProductApiController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> findAll() {
        return productService.findAll()
                .stream()
                .map(productService::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ProductResponse findById(@PathVariable Integer id) {
        return productService.toResponse(productService.findById(id));
    }

    @PostMapping
    public ProductResponse create(@Valid @RequestBody CreateProductRequest request) {
        return productService.toResponse(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    public ProductResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        return productService.toResponse(productService.updateProduct(id, request));
    }
}