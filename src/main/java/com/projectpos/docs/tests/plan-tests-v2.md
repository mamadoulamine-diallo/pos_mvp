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

# Résultats de la campagne de tests V2

## 1. Contexte d'exécution

La campagne de tests de la V2 a été réalisée sur l'environnement local de développement du projet POS.

L'architecture testée comprend notamment :

- API Gateway ;
- Config Server ;
- Consul ;
- user-service ;
- product-service ;
- sale-service ;
- activity-service ;
- bases MySQL séparées pour les services SQL ;
- MongoDB pour le journal d'activité.

Les tests fonctionnels et système ont été réalisés principalement avec Postman. Les tests automatisés Java ont été exécutés avec Maven et les outils de test Spring.

L'objectif de cette campagne est de vérifier les principales règles métier, les communications entre microservices, la persistance SQL et NoSQL, l'authentification ainsi que le comportement de l'application sous une charge locale légère.

---

## 2. Tests automatisés

Les services disposent de tests automatisés ciblant leurs règles métier principales.

### user-service

Les tests couvrent notamment :

- authentification avec un PIN valide ;
- rejet d'un PIN invalide ;
- rejet d'un PIN déjà utilisé lors de la création ;
- création d'un utilisateur actif ;
- contrôle de l'unicité du PIN lors d'une modification ;
- modification valide d'un utilisateur.

**Résultat : 6 tests ciblés validés.**

### product-service

Les tests couvrent notamment :

- ajout de stock ;
- retrait de stock disponible ;
- rejet d'un retrait lorsque le stock est insuffisant ;
- rejet d'une opération sur un produit inexistant ;
- fermeture de l'ancien prix avant création du nouveau ;
- émission d'un événement `PRICE_CHANGED` ;
- maintien du changement de prix lorsque activity-service est indisponible ;
- rejet d'un changement de prix lorsqu'aucun prix actif n'existe.

**Résultat : 8 tests ciblés validés.**

Une attention particulière est portée à l'historisation des prix. L'ancien prix est enregistré comme terminé avant la création du nouveau prix actif. Un `flush()` explicite garantit l'ordre des opérations SQL avant l'insertion du nouveau prix.

### sale-service

Les tests couvrent notamment :

- création d'une vente ;
- conservation du prix du produit au moment de la vente ;
- demande de décrémentation du stock auprès de product-service ;
- rejet d'un produit sans prix actif ;
- absence d'enregistrement de la vente lorsque le retrait de stock échoue.

**Résultat : 4 tests ciblés validés.**

### activity-service

Les tests du contrôleur couvrent notamment :

- création d'un événement ;
- validation des données entrantes ;
- filtrage par type d'événement ;
- filtrage par entité.

**Résultat : 4 tests ciblés validés.**

Au total, **22 tests automatisés ciblés** ont été validés sur les quatre services.

---

## 3. Tests système avec Postman

Une collection dédiée `POS V2 Microservices` et un environnement `POS V2 - Local` ont été créés afin de tester la V2 à travers son point d'entrée principal :

`http://localhost:8080`

Les requêtes passent ainsi par l'API Gateway avant d'être routées vers les microservices concernés.

### 3.1 Authentification

Les scénarios suivants ont été vérifiés :

| Test | Résultat |
| --- | --- |
| Connexion avec un PIN valide | Succès - HTTP 200 |
| Consultation de l'utilisateur connecté | Succès - HTTP 200 |
| Connexion avec un PIN invalide | Rejet - HTTP 401 |
| Création d'une vente sans session valide | Rejet - HTTP 401 |

La tentative de création d'une vente sans authentification retourne :

`Session invalide ou expirée`

La protection des opérations métier nécessitant une session a donc été vérifiée.

---

## 4. Tests du product-service

Les scénarios système suivants ont été exécutés à travers l'API Gateway :

- récupération de la liste des produits ;
- récupération d'un produit ;
- ajout de stock ;
- vérification de la persistance du nouveau stock ;
- changement de prix ;
- vérification du nouveau prix actif ;
- vérification de l'historique des prix.

Un scénario de test a notamment fait évoluer le stock d'un produit de **4 à 6 unités**. La lecture suivante du produit a confirmé la persistance de cette modification.

Le changement de prix testé a fait évoluer le prix de vente de **31 000 à 32 000**.

La consultation de l'historique a confirmé :

- la fermeture de l'ancien prix ;
- la présence du nouveau prix actif ;
- l'existence d'un seul prix actif.

Ce scénario constitue également un test de non-régression de la gestion de l'unicité du prix actif.

---

## 5. Communication product-service vers activity-service

Lors d'un changement de prix, product-service transmet un événement à activity-service.

Le scénario système a vérifié la chaîne suivante :

`API Gateway -> product-service -> activity-service -> MongoDB`

L'événement `PRICE_CHANGED` correspondant au produit testé a été retrouvé dans le journal d'activité.

Les informations contrôlées comprennent notamment :

- le type `PRICE_CHANGED` ;
- l'entité `PRODUCT` ;
- l'identifiant du produit ;
- le service source `product-service` ;
- l'ancien prix ;
- le nouveau prix.

Ce test valide une communication inter-service ainsi que la persistance NoSQL d'un événement métier.

---

## 6. Tests du sale-service

Une vente d'une unité a été créée à travers l'API Gateway.

Le scénario a vérifié :

- la création d'une vente avec le statut `VALIDEE` ;
- l'obtention d'un identifiant de vente ;
- l'appel de product-service pour retirer le stock ;
- la persistance de la décrémentation du stock ;
- la conservation du prix unitaire dans la ligne de vente.

Avant la vente, le produit testé disposait d'un stock de **6 unités**.

Après la vente d'une unité :

`6 -> 5`

La lecture du produit a confirmé un stock de **5 unités**.

Le détail de la vente a également confirmé :

- quantité : 1 ;
- prix unitaire : 32 000 ;
- total de ligne : 32 000 ;
- total de la vente : 32 000.

Le prix unitaire est donc conservé dans la ligne de vente et ne dépend plus du prix courant du produit après l'enregistrement de la vente.

---

## 7. Anomalie détectée pendant la campagne

La campagne de tests système a permis d'identifier une route manquante dans l'API Gateway pour activity-service.

Les routes de user-service, product-service et sale-service étaient présentes, mais `/api/v1/activities/**` n'était pas exposée.

La route suivante a été ajoutée :

    - id: activity-service
      uri: lb://activity-service
      predicates:
        - Path=/api/v1/activities/**

Après redémarrage de l'API Gateway, l'accès à activity-service via le port 8080 a été validé.

Cette anomalie illustre l'intérêt des tests système : les services fonctionnaient individuellement mais l'un d'entre eux n'était pas accessible depuis le point d'entrée global de l'architecture.

---

## 8. Test de charge local

Un test de charge léger a été réalisé avec le Performance Runner de Postman sur l'endpoint :

`GET /api/v1/products`

Cette opération de lecture a été choisie afin d'éviter toute modification des données pendant les répétitions.

### 8.1 Première exécution

Une première exécution a produit un taux d'erreur de **100 %**.

L'analyse de la console Postman a révélé une erreur JavaScript dans le scénario de test :

`SyntaxError: Identifier 'product' has already been declared`

Le script Postman a été corrigé avant de reprendre les mesures.

Les résultats de cette première exécution ne sont donc pas utilisés comme mesures de performance.

### 8.2 Palier de référence - 1 utilisateur virtuel

Configuration :

- profil fixe ;
- 1 utilisateur virtuel ;
- durée : 1 minute.

Résultats :

| Métrique | Valeur |
| --- | ---: |
| Requêtes | 853 |
| Débit moyen | 14,24 req/s |
| Temps de réponse moyen | 16 ms |
| P90 | 22 ms |
| P95 | 27 ms |
| P99 | 33 ms |
| Erreurs | 0 % |
| Échecs | 0 % |
| Pic CPU | 47,8 % |
| Pic mémoire | 95,3 % |

### 8.3 Palier - 3 utilisateurs virtuels

Configuration :

- profil fixe ;
- 3 utilisateurs virtuels ;
- durée : 1 minute.

Résultats :

| Métrique | Valeur |
| --- | ---: |
| Requêtes | 4 033 |
| Débit moyen | 67,53 req/s |
| Temps de réponse moyen | 15 ms |
| P90 | 19 ms |
| P95 | 23 ms |
| P99 | 45 ms |
| Erreurs | 0 % |
| Échecs | 0 % |
| Pic CPU | 74,5 % |
| Pic mémoire | 91 % |

Aucune erreur fonctionnelle n'a été observée pendant ces deux scénarios.

Le passage de 1 à 3 utilisateurs virtuels n'a pas entraîné de dégradation significative du temps de réponse moyen ou du P95 dans les conditions du test.

---

## 9. Limites du test de charge

Les résultats de performance doivent être interprétés dans le contexte de l'environnement utilisé.

Le poste de développement dispose de **16 Go de mémoire vive** et exécute simultanément notamment :

- Postman ;
- l'IDE ;
- plusieurs applications Spring Boot ;
- Docker ;
- Consul ;
- Config Server ;
- plusieurs bases MySQL ;
- MongoDB.

Pendant les tests, l'utilisation mémoire du poste a atteint environ **91 à 95 %**. Postman a également signalé une contrainte sur les ressources système.

Le générateur de charge et le système testé partageant la même machine, ces résultats constituent une **référence locale et non une estimation de la capacité maximale de l'application en production**.

Une campagne ultérieure pourra utiliser un générateur de charge séparé et un environnement de déploiement représentatif afin d'augmenter progressivement le nombre d'utilisateurs virtuels et d'étudier les limites de l'architecture.

---

## 10. Limites architecturales identifiées

La campagne confirme le fonctionnement des principales communications inter-services mais met également en évidence certaines limites connues de l'architecture actuelle.

Lors de la création d'une vente, sale-service demande à product-service de décrémenter le stock avant de persister localement la vente.

Une transaction SQL locale ne peut pas annuler automatiquement une opération déjà réalisée dans un autre microservice. Une panne entre ces opérations peut donc produire une incohérence distribuée.

Une évolution pourra introduire une stratégie de compensation, une Saga ou une architecture événementielle avec mécanisme fiable de publication.

De même, l'envoi d'un événement vers activity-service est actuellement tolérant à l'indisponibilité du service afin de ne pas bloquer le changement de prix. En revanche, l'événement perdu n'est pas rejoué automatiquement.

Une évolution possible serait l'utilisation d'un mécanisme d'outbox et/ou d'une messagerie asynchrone.

---

## 11. Conclusion

La campagne de tests de la V2 a permis de valider les principales règles métier et plusieurs interactions caractéristiques de l'architecture microservices.

Elle couvre notamment :

- des tests automatisés des services ;
- des tests fonctionnels via l'API Gateway ;
- des communications inter-services avec OpenFeign ;
- la persistance SQL ;
- la persistance NoSQL ;
- l'historisation des prix ;
- la décrémentation distribuée du stock ;
- la conservation du prix au moment de la vente ;
- l'authentification et le rejet d'une session invalide ;
- un test de charge local avec mesure de latence, débit et taux d'erreur.

La campagne a également permis d'identifier et de corriger une route manquante dans l'API Gateway et de documenter plusieurs limites de l'architecture distribuée.

Les résultats obtenus constituent une base de non-régression pour la V2 et pour les futures évolutions du projet.