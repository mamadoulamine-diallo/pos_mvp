package com.projectpos.product.repository;

import com.projectpos.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository
        extends JpaRepository<Product, Integer> {
}