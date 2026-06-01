package com.projectpos.product.service;

import com.projectpos.product.dto.ProductSaleCardDto;
import com.projectpos.product.entity.Product;
import com.projectpos.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;
    private final ProductPriceService priceService;

    public ProductService(
            ProductRepository repository,
            ProductPriceService priceService
    ) {
        this.repository = repository;
        this.priceService = priceService;
    }

    public List<Product> findAll() {
        return repository.findAll();
    }

    public List<ProductSaleCardDto> findAllForSale() {
        return repository.findAll()
                .stream()
                .map(product -> new ProductSaleCardDto(
                        product.getId(),
                        product.getName(),
                        product.getImageUrl(),
                        priceService.getActivePrice(product.getId()),
                        product.getCategory().getName(),
                        product.getStockQuantity()
                ))
                .toList();
    }
}