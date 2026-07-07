package com.projectpos.category.controller;

import com.projectpos.category.dto.CategoryResponse;
import com.projectpos.category.dto.CreateCategoryRequest;
import com.projectpos.category.dto.UpdateCategoryRequest;
import com.projectpos.category.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryApiController {

    private final CategoryService categoryService;

    public CategoryApiController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryResponse> findAll() {
        return categoryService.findAll()
                .stream()
                .map(categoryService::toResponse)
                .toList();
    }

    @PostMapping
    public CategoryResponse create(@Valid @RequestBody CreateCategoryRequest request) {
        return categoryService.toResponse(categoryService.createCategory(request));
    }

    @PutMapping("/{id}")
    public CategoryResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateCategoryRequest request
    ) {
        return categoryService.toResponse(categoryService.updateCategory(id, request));
    }
}