package com.projectpos.productservice.product.service;

import com.projectpos.productservice.activity.client.ActivityClient;
import com.projectpos.productservice.activity.dto.CreateActivityEventRequest;
import com.projectpos.productservice.product.dto.ProductPricingResponse;
import com.projectpos.productservice.product.entity.Product;
import com.projectpos.productservice.product.entity.ProductPrice;
import com.projectpos.productservice.product.repository.ProductPriceRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ProductPriceService {

    private final ProductPriceRepository repository;

    // NOUVEAU :
    // Client Feign permettant d'envoyer les événements métier
    // vers activity-service.
    private final ActivityClient activityClient;

    // MODIFIÉ :
    // ActivityClient est maintenant injecté avec le repository.
    public ProductPriceService(
            ProductPriceRepository repository,
            ActivityClient activityClient
    ) {
        this.repository = repository;
        this.activityClient = activityClient;
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

        // NOUVEAU :
        // On mémorise les anciennes valeurs AVANT de fermer le prix actif.
        // Elles serviront ensuite à construire l'événement PRICE_CHANGED.
        BigDecimal oldSalePrice = currentPrice.getSalePrice();
        BigDecimal oldPurchasePrice = currentPrice.getPurchasePrice();

        currentPrice.setEndDate(LocalDateTime.now());

        repository.save(currentPrice);

        /*
         * IMPORTANT - LOGIQUE EXISTANTE CONSERVÉE :
         *
         * Le flush force la mise à jour de l'ancien prix en base
         * avant l'insertion du nouveau prix actif.
         *
         * Cette étape avait corrigé le problème de contrainte
         * d'unicité rencontré lors du changement de prix.
         *
         * NE PAS SUPPRIMER.
         */
        repository.flush();

        ProductPrice newPrice = new ProductPrice();

        newPrice.setProduct(currentPrice.getProduct());
        newPrice.setSalePrice(salePrice);
        newPrice.setPurchasePrice(purchasePrice);
        newPrice.setStartDate(LocalDateTime.now());
        newPrice.setEndDate(null);

        repository.save(newPrice);

        /*
         * NOUVEAU :
         * Une fois le changement de prix enregistré dans MySQL,
         * on transmet un événement PRICE_CHANGED à activity-service.
         *
         * MongoDB ne remplace PAS l'historique des prix MySQL.
         *
         * - MySQL conserve les données métier et l'historique des prix.
         * - MongoDB conserve la trace de l'activité réalisée
         *   sur la plateforme.
         */
        try {

            activityClient.create(
                    new CreateActivityEventRequest(
                            "PRICE_CHANGED",

                            /*
                             * L'utilisateur n'est pas encore transmis
                             * à product-service.
                             *
                             * On laisse donc volontairement userId à null
                             * plutôt que d'inventer une valeur ou de coupler
                             * ce service à HttpSession.
                             */
                            null,

                            "product-service",
                            "PRODUCT",
                            productId.toString(),

                            /*
                             * metadata est volontairement flexible.
                             *
                             * C'est notamment cette structure variable
                             * qui justifie l'utilisation d'un document
                             * MongoDB pour les événements d'activité.
                             */
                            Map.of(
                                    "oldSalePrice", oldSalePrice,
                                    "newSalePrice", salePrice,
                                    "oldPurchasePrice", oldPurchasePrice,
                                    "newPurchasePrice", purchasePrice
                            )
                    )
            );

        } catch (Exception exception) {

            /*
             * IMPORTANT :
             *
             * activity-service est un service de traçabilité.
             * Son indisponibilité ne doit pas empêcher le changement
             * de prix, qui constitue l'opération métier principale.
             *
             * Pour le CDA, nous conservons ici une gestion simple.
             * Une solution plus robuste (messagerie, outbox,
             * retry, etc.) pourra être présentée comme évolution.
             */
            System.err.println(
                    "Activity event could not be recorded: "
                            + exception.getMessage()
            );
        }
    }

    public List<ProductPrice> getPriceHistory(Integer productId) {
        return repository.findByProductIdOrderByStartDateDesc(productId);
    }
}