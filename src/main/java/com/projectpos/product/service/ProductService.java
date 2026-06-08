package com.projectpos.product.service;

import com.projectpos.category.entity.Category;
import com.projectpos.category.repository.CategoryRepository;
import com.projectpos.product.dto.CreateProductRequest;
import com.projectpos.product.dto.ProductSaleCardDto;
import com.projectpos.product.dto.UpdateProductRequest;
import com.projectpos.product.entity.Product;
import com.projectpos.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;
    private final ProductPriceService priceService;
    private final CategoryRepository categoryRepository;

    public ProductService(
            ProductRepository repository,
            ProductPriceService priceService,
            CategoryRepository categoryRepository
    ) {
        this.repository = repository;
        this.priceService = priceService;
        this.categoryRepository = categoryRepository;
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

    public Product createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Catégorie introuvable"));

        Product product = new Product();

        product.setName(request.name());
        product.setImageUrl(request.imageUrl());
        product.setCategory(category);
        product.setStockQuantity(request.stockQuantity());
        product.setActive(true);

        Product savedProduct = repository.save(product);

        priceService.createInitialPrice(
                savedProduct,
                request.salePrice(),
                request.purchasePrice()
        );

        return savedProduct;
    }

    public void addStock(Integer productId, Integer quantity) {

        Product product = repository.findById(productId)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Produit introuvable"
                        )
                );

        product.setStockQuantity(product.getStockQuantity() + quantity);

        repository.save(product);
    }

    public Product updateProduct(Integer productId, UpdateProductRequest request) {
        Product product = repository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Produit introuvable"));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Catégorie introuvable"));

        product.setName(request.name());
        product.setImageUrl(request.imageUrl());
        product.setCategory(category);
        product.setActive(request.active());

        return repository.save(product);
    }

    public Product findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produit introuvable"));
    }
}