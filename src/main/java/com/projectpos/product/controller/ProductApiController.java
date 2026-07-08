package com.projectpos.product.controller;

import com.projectpos.product.dto.*;
import com.projectpos.product.service.ProductPriceService;
import com.projectpos.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(
        name = "Products",
        description = "Product catalog management"
)
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

    @Operation(
            summary = "Retrieve all products",
            description = "Returns the complete product catalog with category, stock status and active sale price."
    )
    @GetMapping
    public List<ProductResponse> findAll() {
        return productService.findAll()
                .stream()
                .map(productService::toResponse)
                .toList();
    }

    @Operation(
            summary = "Retrieve product details",
            description = "Returns detailed information for a single product."
    )
    @GetMapping("/{id}")
    public ProductResponse findById(@PathVariable Integer id) {
        return productService.toResponse(productService.findById(id));
    }

    @Operation(
            summary = "Create product",
            description = "Creates a new product and initializes its first active purchase and sale prices."
    )
    @PostMapping
    public ProductResponse create(@Valid @RequestBody CreateProductRequest request) {
        return productService.toResponse(productService.createProduct(request));
    }

    @Operation(
            summary = "Update product",
            description = "Updates product information such as name, image, category and active status."
    )
    @PutMapping("/{id}")
    public ProductResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        return productService.toResponse(productService.updateProduct(id, request));
    }

    @Operation(
            summary = "Add product stock",
            description = "Increases the available stock quantity for an existing product."
    )
    @PostMapping("/stock")
    public void addStock(@Valid @RequestBody AddStockRequest request) {
        productService.addStock(request.productId(), request.quantity());
    }

    @Operation(
            summary = "Change product price",
            description = "Closes the current active price and creates a new active price for the product."
    )
    @PostMapping("/price")
    public void changePrice(@Valid @RequestBody ChangePriceRequest request) {
        productPriceService.changePrice(
                request.productId(),
                request.salePrice(),
                request.purchasePrice()
        );
    }
}