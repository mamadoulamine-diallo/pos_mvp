package com.projectpos.saleservice.sale.service;

import com.projectpos.saleservice.client.ProductClient;
import com.projectpos.saleservice.client.UserClient;
import com.projectpos.saleservice.client.dto.ProductResponse;
import com.projectpos.saleservice.client.dto.RemoveStockRequest;
import com.projectpos.saleservice.sale.dto.CreateSaleRequest;
import com.projectpos.saleservice.sale.dto.SaleItemRequest;
import com.projectpos.saleservice.sale.entity.Sale;
import com.projectpos.saleservice.sale.entity.SaleItem;
import com.projectpos.saleservice.sale.entity.SaleStatus;
import com.projectpos.saleservice.sale.repository.SaleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SaleServiceTest {

    @Mock
    private SaleRepository repository;

    @Mock
    private ProductClient productClient;

    @Mock
    private UserClient userClient;

    private SaleService saleService;

    @BeforeEach
    void setUp() {
        saleService = new SaleService(
                repository,
                productClient,
                userClient
        );
    }

    /*
     * TEST 1
     *
     * Vérifie la création normale d'une vente.
     *
     * Le service doit :
     * - récupérer le produit via product-service ;
     * - demander le retrait du stock ;
     * - créer le SaleItem ;
     * - figer le prix courant dans unitPrice ;
     * - créer une vente VALIDEE ;
     * - sauvegarder la vente.
     */
    @Test
    void shouldCreateSaleAndFreezeCurrentProductPrice() {

        ProductResponse product = new ProductResponse(
                7,
                "Chemise",
                null,
                true,
                10,
                1,
                "Mode",
                new BigDecimal("28000")
        );

        when(productClient.findById(7))
                .thenReturn(product);

        /*
         * On retourne simplement l'objet reçu par repository.save().
         */
        when(repository.save(any(Sale.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CreateSaleRequest request =
                new CreateSaleRequest(
                        List.of(
                                new SaleItemRequest(
                                        7,
                                        2
                                )
                        )
                );

        Sale result = saleService.createSale(
                request,
                1
        );

        assertNotNull(result);

        assertEquals(
                SaleStatus.VALIDEE,
                result.getStatus()
        );

        assertEquals(
                1,
                result.getUserId()
        );

        assertEquals(
                1,
                result.getItems().size()
        );

        SaleItem item = result.getItems().get(0);

        assertEquals(
                7,
                item.getProductId()
        );

        assertEquals(
                2,
                item.getQuantity()
        );

        /*
         * Test essentiel :
         * SaleItem conserve le prix obtenu au moment
         * de la vente.
         */
        assertEquals(
                new BigDecimal("28000"),
                item.getUnitPrice()
        );

        assertSame(
                result,
                item.getSale()
        );

        verify(productClient)
                .findById(7);

        verify(repository)
                .save(result);
    }

    /*
     * TEST 2
     *
     * Vérifie précisément la demande de retrait
     * de stock envoyée à product-service.
     */
    @Test
    void shouldRequestStockRemovalWhenSaleIsCreated() {

        ProductResponse product = new ProductResponse(
                7,
                "Chemise",
                null,
                true,
                10,
                1,
                "Mode",
                new BigDecimal("28000")
        );

        when(productClient.findById(7))
                .thenReturn(product);

        when(repository.save(any(Sale.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        CreateSaleRequest request =
                new CreateSaleRequest(
                        List.of(
                                new SaleItemRequest(
                                        7,
                                        3
                                )
                        )
                );

        saleService.createSale(
                request,
                1
        );

        ArgumentCaptor<RemoveStockRequest> captor =
                ArgumentCaptor.forClass(
                        RemoveStockRequest.class
                );

        verify(productClient)
                .removeStock(captor.capture());

        RemoveStockRequest stockRequest =
                captor.getValue();

        assertEquals(
                7,
                stockRequest.productId()
        );

        assertEquals(
                3,
                stockRequest.quantity()
        );
    }

    /*
     * TEST 3
     *
     * Une vente ne peut pas être créée si le produit
     * ne possède aucun prix actif.
     *
     * Dans ce cas :
     * - aucun retrait de stock ;
     * - aucune sauvegarde de vente.
     */
    @Test
    void shouldRejectSaleWhenProductHasNoActivePrice() {

        ProductResponse product = new ProductResponse(
                7,
                "Chemise",
                null,
                true,
                10,
                1,
                "Mode",
                null
        );

        when(productClient.findById(7))
                .thenReturn(product);

        CreateSaleRequest request =
                new CreateSaleRequest(
                        List.of(
                                new SaleItemRequest(
                                        7,
                                        2
                                )
                        )
                );

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> saleService.createSale(
                                request,
                                1
                        )
                );

        assertEquals(
                "Aucun prix actif pour Chemise",
                exception.getMessage()
        );

        verify(productClient, never())
                .removeStock(any());

        verify(repository, never())
                .save(any(Sale.class));
    }

    /*
     * TEST 4
     *
     * Si product-service refuse le retrait de stock
     * (par exemple stock insuffisant), l'exception
     * doit interrompre la création de la vente.
     *
     * La vente ne doit surtout pas être sauvegardée.
     */
    @Test
    void shouldNotSaveSaleWhenStockRemovalFails() {

        ProductResponse product = new ProductResponse(
                7,
                "Chemise",
                null,
                true,
                2,
                1,
                "Mode",
                new BigDecimal("28000")
        );

        when(productClient.findById(7))
                .thenReturn(product);

        doThrow(
                new RuntimeException("Stock insuffisant")
        )
                .when(productClient)
                .removeStock(any(RemoveStockRequest.class));

        CreateSaleRequest request =
                new CreateSaleRequest(
                        List.of(
                                new SaleItemRequest(
                                        7,
                                        5
                                )
                        )
                );

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> saleService.createSale(
                                request,
                                1
                        )
                );

        assertEquals(
                "Stock insuffisant",
                exception.getMessage()
        );

        verify(repository, never())
                .save(any(Sale.class));
    }
}