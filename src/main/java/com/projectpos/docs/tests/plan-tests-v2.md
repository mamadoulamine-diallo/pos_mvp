# Plan de tests — Architecture V2

## 1. Objectif

Ce document décrit la stratégie de tests mise en œuvre pour valider la version V2
de l'application POS.

La V2 repose sur une architecture distribuée composée notamment de :

- API Gateway ;
- user-service ;
- product-service ;
- sale-service ;
- activity-service ;
- Config Server ;
- Consul ;
- MySQL ;
- MongoDB.

Les tests ont pour objectifs de vérifier :

- les principales règles métier ;
- les cas d'erreur ;
- les échanges entre microservices ;
- la persistance des données ;
- la non-régression sur des comportements critiques ;
- le comportement de l'application en cas d'indisponibilité d'un service secondaire.

Les validations combinent des tests automatisés et des tests manuels d'intégration.

---

## 2. Stratégie de tests

Plusieurs niveaux de tests sont utilisés.

### 2.1 Tests unitaires

Les tests unitaires isolent les composants métier en simulant leurs dépendances
avec Mockito.

Ils permettent notamment de tester :

- la gestion du stock ;
- la gestion des prix ;
- la création des ventes ;
- l'authentification des utilisateurs ;
- les règles d'unicité du PIN ;
- la génération des événements d'activité.

### 2.2 Tests contrôleur

Le service `activity-service` dispose de tests contrôleur avec MockMvc.

Ils permettent de vérifier :

- la création d'un événement ;
- la validation des données entrantes ;
- la recherche par type d'événement ;
- la recherche par entité.

### 2.3 Tests d'intégration manuels

Les interactions entre les microservices ont également été vérifiées
manuellement sur l'architecture V2 en fonctionnement.

Ces tests concernent notamment :

- le routage via l'API Gateway ;
- la communication entre `sale-service` et `product-service` ;
- la communication entre `sale-service` et `user-service` ;
- la communication entre `product-service` et `activity-service` ;
- la persistance MySQL ;
- la persistance MongoDB ;
- la découverte de services via Consul.

### 2.4 Tests de non-régression

Certains tests automatisés protègent des comportements ayant déjà provoqué
des anomalies pendant le développement.

Le changement de prix constitue notamment un cas de non-régression important.

L'ancien prix actif doit être fermé et synchronisé en base avant l'insertion
du nouveau prix actif.

La séquence attendue est :

1. fermeture de l'ancien prix ;
2. sauvegarde ;
3. `flush()` ;
4. création du nouveau prix actif.

Le test automatisé associé protège la correction apportée à l'ancien problème
de contrainte d'unicité sur le prix actif.

---

# 3. Tests automatisés

## 3.1 activity-service

Chemin :

`microservices/activity-service/src/test/java/com/projectpos/activityservice/activity/controller/ActivityEventControllerTest.java`

### ACT-01 — Création d'un événement

**Type :** test contrôleur automatisé

**Objectif :** vérifier qu'un événement d'activité valide peut être créé.

**Résultat attendu :**

- HTTP 201 ;
- événement retourné avec les informations attendues.

**Statut :** OK

### ACT-02 — Validation des données

**Type :** test contrôleur automatisé

**Objectif :** vérifier qu'un événement invalide est rejeté.

**Résultat attendu :**

- HTTP 400 ;
- présence des erreurs de validation.

**Statut :** OK

### ACT-03 — Recherche par type

**Type :** test contrôleur automatisé

**Objectif :** vérifier la consultation des événements par `eventType`.

**Statut :** OK

### ACT-04 — Recherche par entité

**Type :** test contrôleur automatisé

**Objectif :** vérifier la consultation des événements par type et identifiant
d'entité.

**Statut :** OK

---

## 3.2 product-service

Chemins :

`microservices/product-service/src/test/java/com/projectpos/productservice/product/service/ProductServiceTest.java`

`microservices/product-service/src/test/java/com/projectpos/productservice/product/service/ProductPriceServiceTest.java`

### PROD-01 — Retrait de stock valide

**Objectif :** vérifier qu'un retrait autorisé diminue correctement le stock.

**Statut :** OK

### PROD-02 — Stock insuffisant

**Objectif :** empêcher un stock négatif.

**Résultat attendu :**

- exception métier ;
- stock inchangé ;
- aucune sauvegarde du produit.

**Statut :** OK

### PROD-03 — Produit inexistant

**Objectif :** rejeter une opération sur un produit inexistant.

**Statut :** OK

### PROD-04 — Ajout de stock

**Objectif :** vérifier l'augmentation de la quantité disponible.

**Statut :** OK

### PRICE-01 — Changement de prix

**Objectif :** fermer l'ancien prix et créer le nouveau prix actif.

**Statut :** OK

### PRICE-02 — Événement PRICE_CHANGED

**Objectif :** vérifier l'envoi d'un événement métier vers `activity-service`.

**Statut :** OK

### PRICE-03 — activity-service indisponible

**Objectif :** vérifier que l'indisponibilité du service de traçabilité ne
bloque pas l'opération métier principale.

**Résultat attendu :**

- changement de prix maintenu ;
- erreur de communication interceptée ;
- opération métier non annulée.

**Statut :** OK

### PRICE-04 — Prix actif inexistant

**Objectif :** empêcher un changement lorsqu'aucun prix actif n'existe.

**Statut :** OK

---

## 3.3 sale-service

Chemin :

`microservices/sale-service/src/test/java/com/projectpos/saleservice/sale/service/SaleServiceTest.java`

### SALE-01 — Création d'une vente

**Objectif :** vérifier la création d'une vente valide.

**Résultat attendu :**

- statut `VALIDEE` ;
- utilisateur associé par identifiant ;
- ligne de vente créée ;
- prix unitaire figé.

**Statut :** OK

### SALE-02 — Retrait de stock interservice

**Objectif :** vérifier que `sale-service` demande à `product-service`
de retirer la quantité vendue.

**Statut :** OK

### SALE-03 — Produit sans prix actif

**Objectif :** empêcher la création d'une vente lorsque le produit ne possède
aucun prix actif.

**Résultat attendu :**

- vente rejetée ;
- aucun retrait de stock ;
- aucune sauvegarde de la vente.

**Statut :** OK

### SALE-04 — Échec du retrait de stock

**Objectif :** vérifier qu'une erreur retournée lors du retrait de stock
interrompt la création de la vente.

**Résultat attendu :**

- erreur propagée ;
- vente non sauvegardée.

**Statut :** OK

---

## 3.4 user-service

Chemin :

`microservices/user-service/src/test/java/com/projectpos/userservice/service/UserServiceTest.java`

### USER-01 — Authentification avec PIN valide

**Objectif :** vérifier qu'un utilisateur actif est retrouvé avec un PIN valide.

**Statut :** OK

### USER-02 — PIN invalide

**Objectif :** vérifier le rejet d'un PIN incorrect.

**Résultat attendu :**

`PIN invalide`

**Statut :** OK

### USER-03 — Création avec PIN déjà utilisé

**Objectif :** garantir l'unicité du PIN.

**Résultat attendu :**

- création refusée ;
- utilisateur non sauvegardé.

**Statut :** OK

### USER-04 — Création utilisateur valide

**Objectif :** vérifier la création d'un utilisateur avec un PIN disponible.

**Statut :** OK

### USER-05 — Modification avec PIN appartenant à un autre utilisateur

**Objectif :** empêcher l'utilisation du PIN d'un autre utilisateur.

**Statut :** OK

### USER-06 — Modification utilisateur valide

**Objectif :** vérifier la modification d'un utilisateur lorsque le PIN
reste disponible.

**Statut :** OK

---

# 4. Tests d'intégration réalisés manuellement

## INT-01 — Routage API Gateway

**Objectif :** vérifier que l'API Gateway constitue le point d'entrée de
l'architecture V2.

**Exemples vérifiés :**

- authentification ;
- produits ;
- ventes.

**Résultat :** OK

---

## INT-02 — Création d'une vente distribuée

**Services impliqués :**

- API Gateway ;
- sale-service ;
- product-service ;
- user-service.

**Objectif :** vérifier qu'une vente peut être créée dans l'architecture
microservices et que le stock est correctement mis à jour.

**Résultat :** OK

---

## INT-03 — Historisation du prix de vente

**Objectif :** vérifier qu'une modification du prix courant d'un produit
ne modifie pas le prix enregistré dans une vente antérieure.

**Procédure :**

1. créer une vente ;
2. relever son prix unitaire ;
3. modifier le prix courant du produit ;
4. consulter de nouveau la vente.

**Résultat attendu :**

Le `unitPrice` enregistré dans `SALE_ITEM` reste identique.

**Résultat :** OK

---

## INT-04 — Persistance MongoDB

**Services impliqués :**

- product-service ;
- activity-service ;
- MongoDB.

**Objectif :** vérifier qu'un changement de prix produit un événement
`PRICE_CHANGED`.

**Résultat attendu :**

Un document est enregistré dans la collection `activity_events`.

**Résultat :** OK

---

## INT-05 — Mode dégradé activity-service

**Objectif :** vérifier le comportement lorsque `activity-service`
est indisponible.

**Procédure :**

1. arrêter `activity-service` ;
2. modifier le prix d'un produit ;
3. vérifier le résultat métier.

**Résultat attendu :**

- le changement de prix est enregistré dans MySQL ;
- l'indisponibilité de `activity-service` ne bloque pas l'opération ;
- aucun événement MongoDB n'est créé pendant l'indisponibilité.

**Résultat :** OK

**Limite connue :**

L'événement perdu n'est pas rejoué automatiquement.

Une évolution pourrait utiliser un mécanisme de retry, une Outbox Pattern
ou une messagerie asynchrone.

---

# 5. Limites identifiées

Les tests ont également permis d'identifier certaines limites liées
à l'architecture distribuée.

## 5.1 Transaction distribuée lors d'une vente

Lors de la création d'une vente, `sale-service` demande à `product-service`
de retirer le stock avant d'enregistrer localement la vente.

La transaction JPA de `sale-service` ne peut pas annuler automatiquement
une modification déjà validée dans la base de données de `product-service`.

Une erreur intervenant après le retrait de stock mais avant la sauvegarde
de la vente pourrait donc produire une incohérence distribuée.

Cette limite est identifiée pour la V2.

Des solutions telles qu'une Saga, une opération compensatoire ou une
architecture événementielle pourront être étudiées dans une évolution
ultérieure.

## 5.2 Perte possible d'un événement d'activité

L'indisponibilité de `activity-service` ne bloque volontairement pas
les opérations métier principales.

Cette stratégie améliore la disponibilité du service métier mais peut
entraîner la perte d'un événement de traçabilité.

Une évolution pourra mettre en œuvre une Outbox Pattern ou une messagerie
asynchrone.

---

# 6. Bilan

La stratégie de tests de la V2 associe :

- tests unitaires automatisés ;
- tests contrôleur automatisés ;
- tests d'intégration manuels ;
- tests de non-régression ;
- tests de comportement en mode dégradé.

Les règles métier critiques concernant le stock, les prix, les ventes,
les utilisateurs et la traçabilité disposent ainsi de contrôles
reproductibles.

Les tests ont également permis d'identifier les limites spécifiques
aux transactions distribuées, qui sont documentées comme axes
d'amélioration de l'architecture.