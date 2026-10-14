# 11. Évolution vers la V1 : API REST et React

## 11.1 Objectif de la V1

Après le MVP construit avec Spring MVC et Thymeleaf, la V1 sépare l'interface React du backend Spring Boot. Le monolithe conserve les règles métier et l'accès MySQL ; il expose désormais des ressources JSON sous `/api/v1`. Cette étape prépare la séparation ultérieure des domaines en microservices, présentée au chapitre 12.

## 11.2 Contrats HTTP exposés

Les contrôleurs annotés `@RestController` exposent notamment les routes suivantes :

| Domaine | Méthode et route | Utilisation |
|---|---|---|
| Produits | `GET /api/v1/products` | Liste du catalogue |
| Produits | `POST /api/v1/products` | Création |
| Produits | `PUT /api/v1/products/{id}` | Modification |
| Prix | `POST /api/v1/products/price` | Historisation d'un changement de prix |
| Prix | `GET /api/v1/products/{id}/price-history` | Historique tarifaire |
| Stock | `POST /api/v1/products/stock` | Ajout de quantité |
| Ventes | `GET /api/v1/sales` | Historique |
| Ventes | `GET /api/v1/sales/{id}` | Détail d'une vente |
| Ventes | `POST /api/v1/sales` | Enregistrement d'une vente |
| Authentification | `POST /api/v1/auth/login` | Connexion par PIN |
| Authentification | `GET /api/v1/auth/me` | Session courante |
| Authentification | `POST /api/v1/auth/logout` | Déconnexion |

Les routes de catégories, d'utilisateurs et du tableau de bord sont également exposées par des contrôleurs dédiés. La documentation OpenAPI est configurée avec `/api-docs` et `/swagger-ui`.

## 11.3 Exemple complet : modification du prix d'un produit

L'interface ne manipule pas directement la table `product_price`. Elle transmet un contrat JSON au backend, qui applique la règle métier d'historisation.

**1. Déclenchement dans React.** Le formulaire `ChangePriceForm.jsx` convertit les deux saisies en nombres, rejette les valeurs non positives et appelle `onSubmit` :

```jsx
const sale = Number(salePrice);
const purchase = Number(purchasePrice);

if (sale <= 0 || purchase <= 0) {
  setError("Les prix doivent être supérieurs à zéro.");
  return;
}

await onSubmit(sale, purchase);
```

Le hook `useProducts.js` reçoit cette action, transmet les données au service frontend puis actualise le catalogue :

```javascript
await changePriceService({
  productId,
  salePrice,
  purchasePrice,
});
await refreshProducts();
```

**2. Requête HTTP.** Le module `productApi.js` utilise le client Axios partagé :

```javascript
export async function changeProductPrice(request) {
  await axiosClient.post("/products/price", request);
}
```

`axiosClient.js` définit `baseURL` à partir de `VITE_API_BASE_URL`, active `withCredentials: true` et fixe un délai maximal de dix secondes. La route relative ci-dessus est donc résolue par rapport à l'URL d'API configurée côté frontend.

**3. Réception par Spring Boot.** Dans `ProductApiController.java`, le contrôleur reçoit et valide le DTO avant de déléguer au service :

```java
@PostMapping("/price")
public void changePrice(
        @Valid @RequestBody ChangePriceRequest request
) {
    productPriceService.changePrice(
            request.productId(),
            request.salePrice(),
            request.purchasePrice()
    );
}
```

Le record `ChangePriceRequest` déclare les trois champs obligatoires et impose `@DecimalMin("0.01")` aux prix. `@Valid` déclenche cette validation côté serveur, indépendamment du contrôle réalisé dans React.

**4. Application de la règle métier.** Dans `ProductPriceService.java`, l'ancien prix actif est clôturé avant l'insertion du nouveau :

```java
currentPrice.setEndDate(LocalDateTime.now());
repository.save(currentPrice);
repository.flush();

ProductPrice newPrice = new ProductPrice();
newPrice.setProduct(currentPrice.getProduct());
newPrice.setSalePrice(salePrice);
newPrice.setPurchasePrice(purchasePrice);
newPrice.setStartDate(LocalDateTime.now());
newPrice.setEndDate(null);
repository.save(newPrice);
```

L'appel `flush()` force l'exécution des écritures en attente avant l'insertion du nouveau prix actif. Cette séquence correspond à la règle d'un seul prix actif par produit et conserve les tarifs antérieurs. Dans ce contrôleur, la réussite de l'opération est signalée par une réponse HTTP sans objet métier ; le frontend recharge ensuite les produits.

## 11.4 Autre parcours : création d'une vente

Le service React `saleService.js` construit un `POST` vers `/sales` avec `credentials: "include"`. Le corps JSON contient les identifiants de produits et leurs quantités, mais **pas les prix** :

```javascript
body: JSON.stringify({
  items: items.map((item) => ({
    productId: Number(item.id),
    quantity: item.quantity,
  })),
}),
```

Dans `SaleApiController.java`, `@Valid @RequestBody CreateSaleRequest` reçoit les lignes. `CurrentUserService` retrouve le vendeur depuis la session HTTP. Le contrôleur délègue ensuite à `saleService.createSale(...)` et renvoie `saleId` et `status`.

Le service de vente, annoté `@Transactional`, vérifie le stock, récupère le prix actif côté serveur, décrémente la quantité disponible et copie le prix dans `SaleItem.unitPrice`. La transaction JPA couvre ici les écritures du **monolithe et de sa base** ; elle ne constitue pas une transaction distribuée, question étudiée au chapitre 12.

Cette séparation évite de faire confiance à un montant transmis par le navigateur et préserve le prix appliqué au moment de la vente.

## 11.5 Session HTTP et gestion des réponses

`AuthApiController.java` reçoit le PIN sur `POST /api/v1/auth/login`. Après authentification, il enregistre l'utilisateur sous la clé `currentUser` de la session. `GET /auth/me` restitue l'utilisateur courant ou renvoie `401` si aucune session n'est active ; `POST /auth/logout` invalide la session.

Côté React, `authApi.js` utilise `credentials: "include"` pour transmettre les cookies nécessaires aux appels authentifiés. Le client Axios partagé utilise `withCredentials: true`. Ces options permettent l'envoi des cookies, mais ne suffisent pas, à elles seules, à prouver l'ensemble des protections de sécurité (contrôle d'accès, CSRF et configuration de déploiement), étudiées séparément.

Pour les ventes, `saleService.js` vérifie `response.ok`, tente d'extraire le message d'erreur JSON puis déclenche une exception en cas d'échec. Le formulaire de modification des prix utilise également `try/catch/finally` pour afficher une erreur et réactiver le bouton après la requête.

## 11.6 Bilan technique

Cette V1 conserve les services métier Spring Boot tout en introduisant un frontend React indépendant, des contrats JSON explicites et une organisation frontend par fonctionnalités (`api`, `services`, `hooks`, `components`). Les deux parcours examinés — changement de prix et création de vente — montrent que les règles déterminantes restent exécutées côté serveur.

Le chapitre suivant présente le changement d'échelle architectural : la répartition de ces responsabilités entre services indépendants, avec les contraintes réseau et transactionnelles qui en découlent.
