package com.projectpos.productservice.product.repository;

import com.projectpos.productservice.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
}