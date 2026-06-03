package com.projectpos.sale.service;

import com.projectpos.product.repository.ProductRepository;
import com.projectpos.product.service.ProductPriceService;
import com.projectpos.sale.dto.SaleHistoryDto;
import com.projectpos.sale.entity.Sale;
import com.projectpos.sale.repository.SaleRepository;
import org.springframework.stereotype.Service;
import com.projectpos.product.entity.Product;
import com.projectpos.sale.dto.CreateSaleRequest;
import com.projectpos.sale.dto.SaleItemRequest;
import com.projectpos.sale.entity.SaleItem;
import com.projectpos.sale.entity.SaleStatus;
import com.projectpos.user.entity.AppUser;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
public class SaleService {

    private final SaleRepository repository;
    private final ProductRepository productRepository;
    private final ProductPriceService priceService;

    public SaleService(
            SaleRepository repository,
            ProductRepository productRepository,
            ProductPriceService priceService
    ) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.priceService = priceService;
    }

    public List<Sale> findAll() {
        return repository.findAll();
    }

    @Transactional
    public Sale createSale(CreateSaleRequest request, AppUser currentUser) {
        Sale sale = new Sale();
        sale.setStatus(SaleStatus.VALIDEE);
        sale.setUser(currentUser);

        for (SaleItemRequest itemRequest : request.items()) {

            Product product = productRepository
                    .findById(itemRequest.productId())
                    .orElseThrow(
                            () -> new IllegalArgumentException("Produit introuvable")
                    );

            if (product.getStockQuantity() < itemRequest.quantity()) {
                throw new IllegalArgumentException("Stock insuffisant pour " + product.getName()
                );
            }

            BigDecimal activePrice = priceService.getActivePrice(product.getId());

            product.setStockQuantity(product.getStockQuantity() - itemRequest.quantity());

            productRepository.save(product);

            SaleItem item = new SaleItem();

            item.setSale(sale);
            item.setProduct(product);
            item.setQuantity(itemRequest.quantity());
            item.setUnitPrice(activePrice);

            sale.getItems().add(item);
        }

        return repository.save(sale);
    }

    public List<SaleHistoryDto> getSaleHistory() {
        return repository.findSaleHistory();
    }
}