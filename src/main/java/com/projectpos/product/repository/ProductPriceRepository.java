package com.projectpos.product.repository;

import com.projectpos.product.entity.ProductPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductPriceRepository extends JpaRepository<ProductPrice, Integer> {

    Optional<ProductPrice> findByProductIdAndEndDateIsNull(Integer productId);
}