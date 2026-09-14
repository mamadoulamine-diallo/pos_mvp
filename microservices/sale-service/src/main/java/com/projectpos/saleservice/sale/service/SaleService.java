package com.projectpos.saleservice.sale.service;

import com.projectpos.saleservice.client.ProductClient;
import com.projectpos.saleservice.client.UserClient;
import com.projectpos.saleservice.client.dto.ProductResponse;
import com.projectpos.saleservice.client.dto.RemoveStockRequest;
import com.projectpos.saleservice.client.dto.UserResponse;
import com.projectpos.saleservice.sale.dto.CreateSaleRequest;
import com.projectpos.saleservice.sale.dto.SaleHistoryDto;
import com.projectpos.saleservice.sale.dto.SaleItemRequest;
import com.projectpos.saleservice.sale.dto.SaleDetailDto;
import com.projectpos.saleservice.sale.dto.SaleDetailItemDto;
import com.projectpos.saleservice.sale.entity.Sale;
import com.projectpos.saleservice.sale.entity.SaleItem;
import com.projectpos.saleservice.sale.entity.SaleStatus;
import com.projectpos.saleservice.sale.repository.SaleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SaleService {

    private final SaleRepository repository;
    private final ProductClient productClient;
    private final UserClient userClient;

    public SaleService(
            SaleRepository repository,
            ProductClient productClient,
            UserClient userClient
    ) {
        this.repository = repository;
        this.productClient = productClient;
        this.userClient = userClient;
    }

    public List<Sale> findAll() {
        return repository.findAll();
    }

    public List<SaleHistoryDto> getSaleHistory() {

        return repository.findAllWithItems()
                .stream()
                .map(sale -> {

                    UserResponse user =
                            userClient.findById(sale.getUserId());

                    long itemCount = sale.getItems()
                            .stream()
                            .mapToLong(SaleItem::getQuantity)
                            .sum();

                    BigDecimal total = sale.getItems()
                            .stream()
                            .map(item ->
                                    item.getUnitPrice()
                                            .multiply(
                                                    BigDecimal.valueOf(
                                                            item.getQuantity()
                                                    )
                                            )
                            )
                            .reduce(
                                    BigDecimal.ZERO,
                                    BigDecimal::add
                            );

                    return new SaleHistoryDto(
                            sale.getId(),
                            sale.getSaleDate(),
                            user.fullName(),
                            user.role(),
                            itemCount,
                            total
                    );
                })
                .toList();
    }

    @Transactional
    public Sale createSale(
            CreateSaleRequest request,
            Integer userId
    ) {
        Sale sale = new Sale();
        sale.setStatus(SaleStatus.VALIDEE);
        sale.setUserId(userId);

        for (SaleItemRequest itemRequest : request.items()) {

            ProductResponse product =
                    productClient.findById(itemRequest.productId());

            if (product.salePrice() == null) {
                throw new IllegalArgumentException(
                        "Aucun prix actif pour " + product.name()
                );
            }

            productClient.removeStock(
                    new RemoveStockRequest(
                            itemRequest.productId(),
                            itemRequest.quantity()
                    )
            );

            SaleItem item = new SaleItem();

            item.setSale(sale);
            item.setProductId(product.id());
            item.setQuantity(itemRequest.quantity());
            item.setUnitPrice(product.salePrice());

            sale.getItems().add(item);
        }

        return repository.save(sale);
    }

    public SaleDetailDto getSaleDetailDto(Integer id) {

        Sale sale = repository.findByIdWithItems(id)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Vente introuvable"
                        )
                );

        UserResponse user =
                userClient.findById(sale.getUserId());

        List<SaleDetailItemDto> items =
                sale.getItems()
                        .stream()
                        .map(item -> {

                            ProductResponse product =
                                    productClient.findById(
                                            item.getProductId()
                                    );

                            BigDecimal lineTotal =
                                    item.getUnitPrice()
                                            .multiply(
                                                    BigDecimal.valueOf(
                                                            item.getQuantity()
                                                    )
                                            );

                            return new SaleDetailItemDto(
                                    product.name(),
                                    item.getQuantity(),
                                    item.getUnitPrice(),
                                    lineTotal
                            );
                        })
                        .toList();

        BigDecimal total = items.stream()
                .map(SaleDetailItemDto::lineTotal)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );

        long itemCount = items.stream()
                .mapToLong(SaleDetailItemDto::quantity)
                .sum();

        return new SaleDetailDto(
                sale.getId(),
                user.fullName(),
                sale.getSaleDate(),
                sale.getStatus(),
                user.role(),
                itemCount,
                total,
                items
        );
    }
}