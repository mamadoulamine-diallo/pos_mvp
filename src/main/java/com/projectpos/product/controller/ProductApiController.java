package com.projectpos.product.controller;

import com.projectpos.product.dto.*;
import com.projectpos.product.service.ProductPriceService;
import com.projectpos.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductApiController {

    private final ProductService productService;
    private final ProductPriceService productPriceService;

    public ProductApiController(
            ProductService productService,
            ProductPriceService productPriceService
    ) {
        this.productService = productService;
        this.productPriceService = productPriceService;
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

    @PostMapping("/stock")
    public void addStock(@Valid @RequestBody AddStockRequest request) {
        productService.addStock(request.productId(), request.quantity());
    }

    @PostMapping("/price")
    public void changePrice(@Valid @RequestBody ChangePriceRequest request) {
        productPriceService.changePrice(
                request.productId(),
                request.salePrice(),
                request.purchasePrice()
        );
    }
}