package com.projectpos.category.controller;

import com.projectpos.category.dto.CategoryResponse;
import com.projectpos.category.dto.CreateCategoryRequest;
import com.projectpos.category.dto.UpdateCategoryRequest;
import com.projectpos.category.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
        name = "Categories",
        description = "Product categories management"
)
@RestController
@RequestMapping("/api/v1/categories")
public class CategoryApiController {

    private final CategoryService categoryService;

    public CategoryApiController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(
            summary = "Retrieve all categories",
            description = "Returns all product categories available in the catalog."
    )
    @GetMapping
    public List<CategoryResponse> findAll() {
        return categoryService.findAll()
                .stream()
                .map(categoryService::toResponse)
                .toList();
    }

    @Operation(
            summary = "Create category",
            description = "Creates a new product category."
    )
    @PostMapping
    public CategoryResponse create(@Valid @RequestBody CreateCategoryRequest request) {
        return categoryService.toResponse(categoryService.createCategory(request));
    }

    @Operation(
            summary = "Update category",
            description = "Updates category information and active status."
    )
    @PutMapping("/{id}")
    public CategoryResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateCategoryRequest request
    ) {
        return categoryService.toResponse(categoryService.updateCategory(id, request));
    }
}