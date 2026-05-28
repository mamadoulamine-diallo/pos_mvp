package com.projectpos.category.controller;

import com.projectpos.category.service.CategoryService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

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
}