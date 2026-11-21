# PROJECT_POS — Contexte de référence

**Statut :** Produit en développement — V1 en stabilisation  
**Dernière mise à jour :** 21 novembre 2026  
**Branche active :** `v1-stabilisation`

## 1. Vision du produit

PROJECT_POS est une application de gestion commerciale destinée en priorité aux petites boutiques et commerces de proximité, notamment en Afrique de l'Ouest.

Le projet est né de l'observation de difficultés réelles rencontrées par des commerçants : suivi manuel des ventes, visibilité limitée sur les stocks et difficulté à contrôler l'activité d'un commerce à distance.

L'ambition est de construire progressivement une plateforme simple, fiable et accessible, capable de faciliter la gestion quotidienne d'un commerce et, à terme, la supervision de plusieurs boutiques.

**Principe directeur : la valeur métier prime sur la complexité technique.**

## 2. Utilisateurs cibles

### Vendeur
- Enregistrer rapidement les ventes.
- Consulter les produits et leurs prix.
- Utiliser une interface tactile simple.
- Accéder uniquement aux fonctionnalités autorisées.

### Gérant
- Consulter les ventes et les indicateurs d'activité.
- Gérer les produits, prix et stocks.
- Superviser les utilisateurs.
- Contrôler l'activité commerciale.

Les permissions exactes de chaque rôle devront être formalisées et vérifiées dans le code.

## 3. Objectifs métier

- Réaliser une vente rapidement, avec un objectif d'utilisation inférieur à 30 secondes pour un parcours courant.
- Conserver un historique fiable des transactions.
- Suivre les mouvements de stock.
- Historiser les changements de prix.
- Fournir des indicateurs utiles à la gestion quotidienne.
- Réduire les erreurs et les manipulations non autorisées.

## 4. Architecture retenue pour la V1

### Backend
- Java 21
- Spring Boot
- Spring MVC
- Spring Data JPA / Hibernate
- MySQL
- API REST
- Maven

### Frontend
- React
- JavaScript
- Vite

### Organisation du dépôt

```text
backend/     Application Spring Boot
frontend/    Application React
docs/        Documentation produit et technique
```

L'architecture retenue pour cette étape est un **monolithe Spring Boot avec un frontend React séparé**.

Les travaux expérimentaux en microservices sont conservés sur une autre branche, mais exclus du périmètre de stabilisation de la V1.

## 5. Règles métier fondamentales

### Produits et prix
- Un produit ne doit avoir qu'un seul prix actif à un instant donné.
- Les anciens prix sont conservés dans un historique.
- Une vente conserve le prix unitaire appliqué au moment de la transaction.

### Ventes
- Une vente contient des lignes de vente.
- Les états métier définis comprennent `BROUILLON`, `VALIDEE` et `ANNULEE`.
- La création et la validation des ventes doivent préserver la cohérence des données.

### Stock
- Les opérations de vente doivent respecter les règles de disponibilité du stock.
- Les mises à jour doivent rester cohérentes, y compris en cas d'erreur ou d'accès concurrent.

Les comportements exacts devront être vérifiés pendant l'audit.

## 6. Principes de conception

1. Préserver et améliorer le socle existant plutôt que procéder à une refonte.
2. Privilégier la simplicité d'utilisation.
3. Sécuriser les opérations sensibles.
4. Maintenir une architecture compréhensible et testable.
5. Éviter les fonctionnalités sans valeur métier démontrée.
6. Documenter les décisions importantes.
7. Préparer une première expérimentation auprès de commerçants réels.

## 7. Perspectives commerciales

Une segmentation future est envisagée :

- **Offre simple :** gestion d'un commerce.
- **Offre avancée :** supervision de plusieurs commerces, suivi consolidé et fonctionnalités de contrôle supplémentaires.

Le modèle tarifaire, les abonnements et le périmètre exact des offres ne sont pas encore validés.

## 8. Méthode de travail

Chaque chantier suit le cycle :

**Audit → décision → implémentation → tests → documentation → commit.**

La documentation du dépôt constitue la référence durable du projet.

Les conversations ChatGPT servent à analyser, concevoir, expliquer et accompagner le travail, mais ne remplacent pas la documentation versionnée.