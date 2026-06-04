package com.projectpos.product.service;

import com.projectpos.product.entity.Product;
import com.projectpos.product.entity.ProductPrice;
import com.projectpos.product.repository.ProductPriceRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ProductPriceService {

    private final ProductPriceRepository repository;

    public ProductPriceService(ProductPriceRepository repository) {
        this.repository = repository;
    }

    public BigDecimal getActivePrice(Integer productId) {
        return repository.findByProductIdAndEndDateIsNull(productId)
                .map(ProductPrice::getSalePrice)
                .orElse(BigDecimal.ZERO);
    }

    public ProductPrice createInitialPrice(
            Product product,
            BigDecimal salePrice,
            BigDecimal purchasePrice
    ) {
        ProductPrice productPrice = new ProductPrice();

        productPrice.setProduct(product);
        productPrice.setSalePrice(salePrice);
        productPrice.setPurchasePrice(purchasePrice);
        productPrice.setStartDate(LocalDateTime.now());
        productPrice.setEndDate(null);

        return repository.save(productPrice);
    }
}