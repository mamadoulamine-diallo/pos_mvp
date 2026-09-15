# 6. Modélisation des données

## 6.1 Règles de gestion

Avant la conception de la base de données, plusieurs règles de gestion ont été identifiées à partir des besoins métier du projet.

Ces règles permettent de garantir la cohérence des données et de structurer le modèle de manière conforme au fonctionnement réel d’un commerce.

Les principales règles retenues sont les suivantes :

* Un utilisateur se connecte à l’application grâce à un code PIN unique.
* Un utilisateur possède un rôle permettant de définir ses droits d’accès.
* Un utilisateur peut être actif ou inactif.
* Une catégorie peut contenir plusieurs produits.
* Un produit appartient obligatoirement à une seule catégorie.
* Un produit peut être actif ou inactif.
* Un produit possède une quantité disponible en stock.
* Un produit peut apparaître dans plusieurs ventes.
* Un produit peut avoir plusieurs prix dans le temps.
* Un seul prix peut être actif pour un produit à un instant donné.
* Une vente est réalisée par un utilisateur.
* Une vente contient une ou plusieurs lignes de vente.
* Chaque ligne de vente concerne un seul produit.
* Chaque ligne de vente conserve le prix unitaire appliqué lors de la transaction.
* La validation d’une vente entraîne la décrémentation du stock.
* Les indicateurs du tableau de bord sont calculés uniquement à partir des ventes validées.

Ces règles constituent le socle fonctionnel de la modélisation des données.

---

## 6.2 Dictionnaire de données

Le dictionnaire de données permet de recenser les principales informations manipulées par l’application.

### AppUser

| Attribut | Description                  |
| -------- | ---------------------------- |
| id       | Identifiant unique           |
| fullName | Nom complet de l'utilisateur |
| email    | Adresse électronique         |
| pinCode  | Code PIN de connexion        |
| role     | Rôle métier                  |
| active   | État du compte               |

### Category

| Attribut | Description          |
| -------- | -------------------- |
| id       | Identifiant unique   |
| name     | Nom de la catégorie  |
| active   | État de la catégorie |

### Product

| Attribut      | Description         |
| ------------- | ------------------- |
| id            | Identifiant unique  |
| name          | Nom du produit      |
| imageUrl      | Image du produit    |
| stockQuantity | Quantité disponible |
| active        | État du produit     |

### ProductPrice

| Attribut      | Description               |
| ------------- | ------------------------- |
| id            | Identifiant unique        |
| purchasePrice | Prix d'achat              |
| salePrice     | Prix de vente             |
| startDate     | Date de début de validité |
| endDate       | Date de fin de validité   |

### Sale

| Attribut | Description        |
| -------- | ------------------ |
| id       | Identifiant unique |
| saleDate | Date de la vente   |
| status   | Statut de la vente |

### SaleItem

| Attribut  | Description            |
| --------- | ---------------------- |
| id        | Identifiant unique     |
| quantity  | Quantité vendue        |
| unitPrice | Prix unitaire appliqué |

---

## 6.3 Modèle Conceptuel de Données (MCD)

Le Modèle Conceptuel de Données représente les informations métier indépendamment de toute considération technique.

Les entités principales identifiées sont :

* AppUser
* Category
* Product
* ProductPrice
* Sale
* SaleItem

Les relations métier sont les suivantes :

### Utilisateur et vente

Un utilisateur peut réaliser plusieurs ventes.

Une vente est obligatoirement réalisée par un seul utilisateur.

```text
AppUser 1 ─── * Sale
```

### Catégorie et produit

Une catégorie peut contenir plusieurs produits.

Un produit appartient obligatoirement à une catégorie.

```text
Category 1 ─── * Product
```

### Produit et historique de prix

Un produit peut posséder plusieurs prix dans le temps.

Chaque prix est associé à un seul produit.

```text
Product 1 ─── * ProductPrice
```

### Vente et lignes de vente

Une vente contient une ou plusieurs lignes.

Chaque ligne appartient à une seule vente.

```text
Sale 1 ─── * SaleItem
```

### Produit et lignes de vente

Un produit peut apparaître dans plusieurs lignes de vente.

Chaque ligne concerne un seul produit.

```text
Product 1 ─── * SaleItem
```

Le MCD permet de représenter fidèlement les règles métier identifiées lors de l’analyse des besoins.

---

## 6.4 Modèle Logique de Données (MLD)

Le MLD constitue la traduction relationnelle du MCD.

Les principales tables obtenues sont :

```text
APP_USER
(
    id,
    full_name,
    email,
    pin_code,
    role,
    active
)

CATEGORY
(
    id,
    name,
    active
)

PRODUCT
(
    id,
    name,
    image_url,
    stock_quantity,
    active,
    category_id
)

PRODUCT_PRICE
(
    id,
    product_id,
    purchase_price,
    sale_price,
    start_date,
    end_date
)

SALE
(
    id,
    sale_date,
    status,
    user_id
)

SALE_ITEM
(
    id,
    sale_id,
    product_id,
    quantity,
    unit_price
)
```

Les clés étrangères permettent de matérialiser les relations identifiées dans le modèle conceptuel.

---

## 6.5 Modèle Physique de Données (MPD)

Le MPD correspond à l’implémentation effective du modèle dans MySQL.

Les principales décisions techniques retenues sont :

* utilisation de clés primaires auto-incrémentées ;
* utilisation de clés étrangères pour garantir l’intégrité référentielle ;
* utilisation de DECIMAL pour les montants financiers ;
* utilisation de DATETIME pour les dates métier ;
* utilisation de contraintes d’unicité sur les données sensibles ;
* utilisation d’index sur les colonnes fréquemment sollicitées.

Exemples :

* PIN utilisateur unique ;
* index sur les dates de vente ;
* index sur les relations entre produits et catégories ;
* index sur les prix actifs.

Cette structure permet d’assurer la cohérence des données tout en conservant de bonnes performances.

---

## 6.6 Justification des choix de modélisation

La conception du modèle de données a été guidée par des considérations métier avant les considérations techniques.

L’une des décisions les plus importantes concerne la séparation entre Product et ProductPrice.

Plutôt que de stocker directement le prix dans la table produit, une entité dédiée a été créée afin de conserver l’historique des évolutions tarifaires.

Cette approche permet de connaître les anciens prix, d’assurer la traçabilité des modifications et de préparer la mise en place future d’analyses statistiques plus avancées.

Une autre décision importante concerne l’entité SaleItem.

Le prix unitaire est conservé directement dans chaque ligne de vente afin de préserver l’historique réel des transactions. Ainsi, une modification ultérieure du prix d’un produit n’altère jamais les ventes déjà enregistrées.

Enfin, le choix d’une base de données relationnelle a été retenu pour le MVP afin de bénéficier des garanties ACID, de l’intégrité référentielle et de la cohérence des données nécessaires à une application manipulant des transactions commerciales.

Cette modélisation constitue aujourd’hui une base solide permettant d’assurer la stabilité du MVP tout en préparant les futures évolutions du projet.
