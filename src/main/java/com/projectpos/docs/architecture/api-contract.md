# API Contract — POS Platform

## Objectif

Ce document définit les conventions de conception de l'API REST du projet POS.

L'objectif est de garantir la stabilité du contrat entre le backend et les différents consommateurs de l'API (React, application mobile, services externes, futurs microservices).

Le backend constitue désormais une plateforme de services indépendante de l'interface utilisateur.

---

# Principes d'architecture

L'API respecte les principes REST.

Elle expose les ressources métier sans dépendre de l'interface graphique.

Le backend peut ainsi être consommé par :

- l'application React
- une application mobile
- un site e-commerce
- des partenaires externes
- de futurs microservices

L'interface utilisateur n'est qu'un consommateur de l'API.

---

# Versionnement

Toutes les routes REST sont versionnées.

Convention :

/api/v{version}/{resource}

Exemples :

/api/v1/products

/api/v1/categories

/api/v1/users

/api/v1/sales

/api/v1/dashboard

Le versionnement permet de faire évoluer l'API sans casser les applications clientes existantes.

---

# Ressources exposées

## Products

Gestion du catalogue produit.

Fonctionnalités :

- consultation
- création
- modification
- ajout de stock
- changement de prix

---

## Categories

Gestion des catégories produits.

Fonctionnalités :

- consultation
- création
- modification

---

## Users

Gestion des utilisateurs.

Fonctionnalités :

- consultation
- création
- modification
- récupération des rôles

---

## Sales

Gestion des ventes.

Fonctionnalités :

- historique
- détail
- création d'une vente

Une vente constitue un processus métier et non un simple CRUD.

---

## Dashboard

Le dashboard n'est pas une ressource persistée.

Il représente une projection métier calculée à partir des ventes.

L'API expose plusieurs endpoints spécialisés :

- summary
- top-products
- recent-sales
- revenue
- stock-alerts

Cette approche limite le couplage entre le frontend et le backend.

---

# Convention de nommage

Les ressources utilisent des noms au pluriel.

Exemples :

products

categories

users

sales

Les verbes HTTP expriment les actions :

GET

POST

PUT

DELETE (à venir si nécessaire)

Les URLs ne contiennent jamais de verbes.

---

# Format des échanges

Toutes les requêtes utilisent le format JSON.

Toutes les réponses REST utilisent JSON.

Les objets échangés sont représentés par des DTO afin de ne jamais exposer directement les entités JPA.

---

# Validation

La validation est réalisée à deux niveaux.

Validation technique :

- Bean Validation
- annotations Jakarta Validation

Validation métier :

- Services Spring

Les règles métier ne sont jamais implémentées dans les contrôleurs.

---

# Gestion des erreurs

Les erreurs sont centralisées via GlobalExceptionHandler.

Toutes les erreurs REST utilisent un format commun.

Exemple :

{
"timestamp": "...",
"status": 400,
"error": "Bad Request",
"message": "...",
"path": "/api/v1/..."
}

Cette approche garantit des réponses homogènes pour tous les consommateurs de l'API.

---

# Authentification

## MVP

Authentification par session HTTP.

L'utilisateur connecté est récupéré via CurrentUserService.

---

## V1

Migration vers JWT.

Les services métier ne dépendront plus de la session.

CurrentUserService constituera la couche d'abstraction entre la sécurité et le métier.

---

## Évolutions possibles

L'architecture permettra l'intégration future de :

- OAuth2
- OpenID Connect
- Keycloak

sans modifier les services métier.

---

# Philosophie métier

Le backend ne représente pas uniquement une caisse.

Il constitue la première brique d'une plateforme de supervision commerciale.

Le modèle actuel couvre :

- utilisateurs
- produits
- catégories
- ventes
- historique des prix
- tableau de bord

Les évolutions futures intégreront progressivement :

- entreprises
- boutiques
- transferts de stock
- remises d'argent
- fournisseurs
- commandes fournisseurs
- abonnements SaaS

sans remettre en cause le contrat REST établi.

---

# Compatibilité

Toute évolution incompatible donnera lieu à une nouvelle version de l'API.

Exemple :

/api/v1

↓

/api/v2

Les anciennes versions pourront coexister afin d'assurer la compatibilité avec les applications clientes.

---

# Vision

Le projet POS n'est pas conçu comme une simple application de caisse.

Le MVP constitue la première étape d'une plateforme de supervision commerciale destinée aux commerces de proximité.

L'objectif à long terme est de fournir une solution SaaS capable de centraliser les ventes, les stocks, les flux financiers et le pilotage d'entreprises mono-boutique ou multi-boutiques.