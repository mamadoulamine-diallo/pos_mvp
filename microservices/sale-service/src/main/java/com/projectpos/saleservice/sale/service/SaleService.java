package com.projectpos.saleservice.sale.service;

import com.projectpos.saleservice.client.ProductClient;
import com.projectpos.saleservice.client.dto.ProductResponse;
import com.projectpos.saleservice.client.dto.RemoveStockRequest;
import com.projectpos.saleservice.sale.dto.CreateSaleRequest;
import com.projectpos.saleservice.sale.dto.SaleItemRequest;
import com.projectpos.saleservice.sale.entity.Sale;
import com.projectpos.saleservice.sale.entity.SaleItem;
import com.projectpos.saleservice.sale.entity.SaleStatus;
import com.projectpos.saleservice.sale.repository.SaleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleService {

    private final SaleRepository repository;
    private final ProductClient productClient;

    public SaleService(
            SaleRepository repository,
            ProductClient productClient
    ) {
        this.repository = repository;
        this.productClient = productClient;
    }

    public List<Sale> findAll() {
        return repository.findAll();
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

            // Prix figé au moment de la vente
            item.setUnitPrice(product.salePrice());

            sale.getItems().add(item);
        }

        return repository.save(sale);
    }
}