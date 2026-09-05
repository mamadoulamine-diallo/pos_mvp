package com.projectpos.productservice.product.service;

import com.projectpos.productservice.product.dto.ProductPricingResponse;
import com.projectpos.productservice.product.entity.Product;
import com.projectpos.productservice.product.entity.ProductPrice;
import com.projectpos.productservice.product.repository.ProductPriceRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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

    public ProductPricingResponse getCurrentPricing(Integer productId) {

        ProductPrice currentPrice =
                repository.findByProductIdAndEndDateIsNull(productId)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Prix actif introuvable"
                                )
                        );

        return new ProductPricingResponse(
                productId,
                currentPrice.getProduct().getName(),
                currentPrice.getSalePrice(),
                currentPrice.getPurchasePrice()
        );
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

    public void changePrice(
            Integer productId,
            BigDecimal salePrice,
            BigDecimal purchasePrice
    ) {

        ProductPrice currentPrice =
                repository.findByProductIdAndEndDateIsNull(productId)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Prix actif introuvable"
                                )
                        );

        currentPrice.setEndDate(LocalDateTime.now());

        repository.save(currentPrice);

        // On conserve exactement le comportement qui avait
        // résolu le problème de contrainte du prix actif.
        repository.flush();

        ProductPrice newPrice = new ProductPrice();

        newPrice.setProduct(currentPrice.getProduct());
        newPrice.setSalePrice(salePrice);
        newPrice.setPurchasePrice(purchasePrice);
        newPrice.setStartDate(LocalDateTime.now());
        newPrice.setEndDate(null);

        repository.save(newPrice);
    }

    public List<ProductPrice> getPriceHistory(Integer productId) {
        return repository.findByProductIdOrderByStartDateDesc(productId);
    }
}