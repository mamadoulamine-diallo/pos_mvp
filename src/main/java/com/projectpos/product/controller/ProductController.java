package com.projectpos.product.controller;

import com.projectpos.category.service.CategoryService;
import com.projectpos.product.dto.CreateProductRequest;
import com.projectpos.product.entity.Product;
import com.projectpos.product.service.ProductPriceService;
import com.projectpos.product.service.ProductService;
import com.projectpos.user.entity.AppUser;
import jakarta.servlet.http.HttpSession;
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
    private final CategoryService categoryService;

    public ProductController(ProductService service, ProductPriceService priceService, CategoryService categoryService) {
        this.service = service;
        this.priceService = priceService;
        this.categoryService = categoryService;
    }

    @GetMapping("/products")
    public String listProducts(HttpSession session, Model model) {
        AppUser currentUser = (AppUser) session.getAttribute("currentUser");

        if (currentUser == null) {
            return "redirect:/login";
        }

        model.addAttribute("currentUser", currentUser);
        model.addAttribute("products", service.findAll());
        model.addAttribute("priceService", priceService);
        model.addAttribute("categories", categoryService.findAll());

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