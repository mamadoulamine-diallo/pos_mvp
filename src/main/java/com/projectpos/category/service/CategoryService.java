package com.projectpos.category.service;

import com.projectpos.category.dto.CreateCategoryRequest;
import com.projectpos.category.dto.UpdateCategoryRequest;
import com.projectpos.category.entity.Category;
import com.projectpos.category.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public List<Category> findAll() {
        return repository.findAll();
    }

    public Category createCategory(CreateCategoryRequest request) {
        Category category = new Category();
        category.setName(request.name());
        category.setActive(true);

        return repository.save(category);
    }

    public Category updateCategory(Integer id, UpdateCategoryRequest request) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Catégorie introuvable"));

        category.setName(request.name());
        category.setActive(request.active());

        return repository.save(category);
    }
}