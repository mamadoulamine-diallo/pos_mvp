package com.projectpos.product.service;

import com.projectpos.product.entity.ProductPrice;
import com.projectpos.product.repository.ProductPriceRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ProductPriceService {

    private final ProductPriceRepository repository;

    public ProductPriceService(ProductPriceRepository repository) {
        this.repository = repository;
    }

    public BigDecimal getActivePrice(Integer productId) {
        return repository.findByProductIdAndEndDateIsNull(productId)
                .map(ProductPrice::getPrice)
                .orElse(BigDecimal.ZERO);
    }
}