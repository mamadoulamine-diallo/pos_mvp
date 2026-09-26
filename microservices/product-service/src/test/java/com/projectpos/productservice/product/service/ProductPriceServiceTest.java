package com.projectpos.productservice.product.service;

import com.projectpos.productservice.activity.client.ActivityClient;
import com.projectpos.productservice.activity.dto.CreateActivityEventRequest;
import com.projectpos.productservice.product.entity.Product;
import com.projectpos.productservice.product.entity.ProductPrice;
import com.projectpos.productservice.product.repository.ProductPriceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductPriceServiceTest {

    @Mock
    private ProductPriceRepository repository;

    @Mock
    private ActivityClient activityClient;

    private ProductPriceService productPriceService;

    @BeforeEach
    void setUp() {
        productPriceService = new ProductPriceService(
                repository,
                activityClient
        );
    }

    /*
     * TEST 1
     *
     * Vérifie qu'un changement de prix :
     * - ferme l'ancien prix ;
     * - effectue le flush ;
     * - crée le nouveau prix actif.
     *
     * Ce test protège notamment la correction apportée
     * après le problème de contrainte d'unicité
     * rencontré sur le prix actif.
     */
    @Test
    void shouldCloseCurrentPriceBeforeCreatingNewPrice() {

        Product product = new Product();
        product.setId(7);
        product.setName("Chemise");

        ProductPrice currentPrice = new ProductPrice();
        currentPrice.setProduct(product);
        currentPrice.setSalePrice(new BigDecimal("25000"));
        currentPrice.setPurchasePrice(new BigDecimal("18000"));
        currentPrice.setEndDate(null);

        when(repository.findByProductIdAndEndDateIsNull(7))
                .thenReturn(Optional.of(currentPrice));

        productPriceService.changePrice(
                7,
                new BigDecimal("28000"),
                new BigDecimal("20000")
        );

        // L'ancien prix doit maintenant être fermé.
        assertNotNull(currentPrice.getEndDate());

        /*
         * On vérifie l'ordre des opérations critiques :
         *
         * 1. sauvegarde ancien prix fermé
         * 2. flush
         * 3. sauvegarde nouveau prix
         */
        InOrder inOrder = inOrder(repository);

        inOrder.verify(repository).save(currentPrice);
        inOrder.verify(repository).flush();

        ArgumentCaptor<ProductPrice> priceCaptor =
                ArgumentCaptor.forClass(ProductPrice.class);

        inOrder.verify(repository).save(priceCaptor.capture());

        ProductPrice newPrice = priceCaptor.getValue();

        assertNotSame(currentPrice, newPrice);

        assertEquals(
                new BigDecimal("28000"),
                newPrice.getSalePrice()
        );

        assertEquals(
                new BigDecimal("20000"),
                newPrice.getPurchasePrice()
        );

        assertNull(newPrice.getEndDate());

        assertSame(product, newPrice.getProduct());
        assertNotNull(newPrice.getStartDate());
    }

    /*
     * TEST 2
     *
     * Vérifie qu'après un changement de prix,
     * product-service demande bien à activity-service
     * d'enregistrer un événement PRICE_CHANGED.
     */
    @Test
    void shouldSendPriceChangedActivityEvent() {

        Product product = new Product();
        product.setId(7);
        product.setName("Chemise");

        ProductPrice currentPrice = new ProductPrice();
        currentPrice.setProduct(product);
        currentPrice.setSalePrice(new BigDecimal("25000"));
        currentPrice.setPurchasePrice(new BigDecimal("18000"));

        when(repository.findByProductIdAndEndDateIsNull(7))
                .thenReturn(Optional.of(currentPrice));

        productPriceService.changePrice(
                7,
                new BigDecimal("28000"),
                new BigDecimal("20000")
        );

        ArgumentCaptor<CreateActivityEventRequest> eventCaptor =
                ArgumentCaptor.forClass(
                        CreateActivityEventRequest.class
                );

        verify(activityClient).create(eventCaptor.capture());

        CreateActivityEventRequest event =
                eventCaptor.getValue();

        assertEquals("PRICE_CHANGED", event.eventType());
        assertEquals("product-service", event.sourceService());
        assertEquals("PRODUCT", event.entityType());
        assertEquals("7", event.entityId());

        assertEquals(
                new BigDecimal("25000"),
                event.metadata().get("oldSalePrice")
        );

        assertEquals(
                new BigDecimal("28000"),
                event.metadata().get("newSalePrice")
        );

        assertEquals(
                new BigDecimal("18000"),
                event.metadata().get("oldPurchasePrice")
        );

        assertEquals(
                new BigDecimal("20000"),
                event.metadata().get("newPurchasePrice")
        );
    }

    /*
     * TEST 3
     *
     * activity-service est secondaire par rapport
     * à l'opération métier de changement de prix.
     *
     * Si ActivityClient échoue, changePrice()
     * ne doit donc pas propager l'exception.
     */
    @Test
    void shouldKeepPriceChangeSuccessfulWhenActivityServiceFails() {

        Product product = new Product();
        product.setId(7);
        product.setName("Chemise");

        ProductPrice currentPrice = new ProductPrice();
        currentPrice.setProduct(product);
        currentPrice.setSalePrice(new BigDecimal("25000"));
        currentPrice.setPurchasePrice(new BigDecimal("18000"));

        when(repository.findByProductIdAndEndDateIsNull(7))
                .thenReturn(Optional.of(currentPrice));

        doThrow(new RuntimeException("activity-service unavailable"))
                .when(activityClient)
                .create(any(CreateActivityEventRequest.class));

        assertDoesNotThrow(
                () -> productPriceService.changePrice(
                        7,
                        new BigDecimal("28000"),
                        new BigDecimal("20000")
                )
        );

        // L'ancien prix a quand même été fermé.
        assertNotNull(currentPrice.getEndDate());

        // La séquence SQL critique a quand même eu lieu.
        verify(repository).flush();

        /*
         * Deux sauvegardes :
         * - ancien prix fermé
         * - nouveau prix actif
         */
        verify(repository, times(2))
                .save(any(ProductPrice.class));
    }

    /*
     * TEST 4
     *
     * Aucun changement n'est possible lorsqu'il
     * n'existe pas de prix actif pour le produit.
     */
    @Test
    void shouldRejectPriceChangeWhenActivePriceDoesNotExist() {

        when(repository.findByProductIdAndEndDateIsNull(999))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> productPriceService.changePrice(
                                999,
                                new BigDecimal("28000"),
                                new BigDecimal("20000")
                        )
                );

        assertEquals(
                "Prix actif introuvable",
                exception.getMessage()
        );

        verify(repository, never()).save(any());
        verify(repository, never()).flush();
        verifyNoInteractions(activityClient);
    }
}