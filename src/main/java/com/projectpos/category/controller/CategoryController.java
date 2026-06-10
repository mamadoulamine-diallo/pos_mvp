package com.projectpos.category.controller;

import com.projectpos.category.dto.CreateCategoryRequest;
import com.projectpos.category.dto.UpdateCategoryRequest;
import com.projectpos.category.entity.Category;
import com.projectpos.category.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping("/categories")
    public String listCategories(Model model) {
        model.addAttribute("categories", service.findAll());
        return "category/list";
    }

    @PostMapping("/categories")
    @ResponseBody
    public Map<String, Object> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        Category category = service.createCategory(request);

        return Map.of(
                "categoryId", category.getId(),
                "name", category.getName()
        );
    }

    @PutMapping("/categories/{id}")
    @ResponseBody
    public Map<String, Object> updateCategory(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateCategoryRequest request
    ) {
        Category category = service.updateCategory(id, request);

        return Map.of(
                "categoryId", category.getId(),
                "name", category.getName(),
                "active", category.getActive()
        );
    }
}