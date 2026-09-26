package com.projectpos.productservice.product.service;

import com.projectpos.productservice.category.repository.CategoryRepository;
import com.projectpos.productservice.product.entity.Product;
import com.projectpos.productservice.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository repository;

    @Mock
    private ProductPriceService priceService;

    @Mock
    private CategoryRepository categoryRepository;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(
                repository,
                priceService,
                categoryRepository
        );
    }

    /*
     * TEST 1
     *
     * Vérifie qu'un retrait de stock valide
     * diminue correctement la quantité disponible.
     *
     * Stock initial : 10
     * Retrait       : 3
     * Stock attendu : 7
     */
    @Test
    void shouldRemoveStockWhenQuantityIsAvailable() {

        Product product = new Product();
        product.setName("Chemise");
        product.setStockQuantity(10);

        when(repository.findById(1))
                .thenReturn(Optional.of(product));

        productService.removeStock(1, 3);

        assertEquals(7, product.getStockQuantity());

        verify(repository).findById(1);
        verify(repository).save(product);
    }

    /*
     * TEST 2
     *
     * Vérifie la règle métier principale :
     * il est impossible de retirer une quantité
     * supérieure au stock disponible.
     *
     * Stock initial : 2
     * Retrait       : 5
     *
     * Résultat attendu :
     * IllegalArgumentException + aucune sauvegarde.
     */
    @Test
    void shouldRejectStockRemovalWhenQuantityIsInsufficient() {

        Product product = new Product();
        product.setName("Chemise");
        product.setStockQuantity(2);

        when(repository.findById(1))
                .thenReturn(Optional.of(product));

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> productService.removeStock(1, 5)
                );

        assertEquals(
                "Stock insuffisant pour Chemise",
                exception.getMessage()
        );

        /*
         * Très important :
         * on vérifie également que le produit
         * n'est jamais sauvegardé après le rejet.
         */
        verify(repository, never()).save(product);

        // Le stock doit rester intact.
        assertEquals(2, product.getStockQuantity());
    }

    /*
     * TEST 3
     *
     * Vérifie le comportement lorsqu'un produit
     * inexistant est demandé.
     */
    @Test
    void shouldRejectStockRemovalWhenProductDoesNotExist() {

        when(repository.findById(999))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> productService.removeStock(999, 1)
                );

        assertEquals(
                "Produit introuvable",
                exception.getMessage()
        );

        verify(repository, never()).save(
                org.mockito.ArgumentMatchers.any(Product.class)
        );
    }

    /*
     * TEST 4
     *
     * Vérifie l'ajout normal de stock.
     *
     * Stock initial : 10
     * Ajout          : 5
     * Stock attendu  : 15
     */
    @Test
    void shouldAddStock() {

        Product product = new Product();
        product.setName("Chemise");
        product.setStockQuantity(10);

        when(repository.findById(1))
                .thenReturn(Optional.of(product));

        productService.addStock(1, 5);

        assertEquals(15, product.getStockQuantity());

        verify(repository).save(product);
    }
}