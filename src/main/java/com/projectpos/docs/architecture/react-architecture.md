# React Architecture — POS Platform V1

# Objectif

Ce document définit l'architecture du frontend React de la V1.

Le frontend est conçu comme un client de l'API REST.

Il ne contient aucune logique métier.

Toute la logique métier reste implémentée dans le backend Spring Boot.

Le frontend est responsable de :

- l'expérience utilisateur ;
- la navigation ;
- la présentation des données ;
- les appels API ;
- la gestion de l'état de l'interface.

---

# Principes d'architecture

Le frontend est organisé par fonctionnalités (Feature-Based Architecture).

Chaque domaine métier possède son propre espace de travail.

Cette approche facilite :

- la maintenance ;
- l'évolutivité ;
- le travail en équipe ;
- la transition future vers une architecture microservices.

---

# Arborescence générale

src/

├── app/

├── assets/

├── layouts/

├── shared/

├── features/

└── main.jsx

---

# app/

Contient le cœur de l'application.

Responsabilités :

- configuration React
- Router
- Providers
- Theme
- configuration Axios
- gestion globale

Exemples :

App.jsx

router.jsx

providers.jsx

---

# assets/

Contient uniquement les ressources statiques.

Exemples :

images

logos

fonts

icons

---

# layouts/

Contient les layouts principaux.

Exemples :

MainLayout

AuthLayout

DashboardLayout

---

# shared/

Contient les éléments réutilisables dans toute l'application.

Exemples :

components/

hooks/

services/

utils/

constants/

types/

api/

---

# shared/components

Composants génériques.

Exemples :

Button

Input

Modal

Table

Card

Badge

Loader

Pagination

Toast

---

# shared/api

Configuration des appels HTTP.

Exemples :

axiosClient.js

interceptors.js

auth.js

---

# shared/utils

Fonctions utilitaires.

Exemples :

formatCurrency

formatDate

validators

---

# shared/hooks

Hooks génériques.

Exemples :

useDebounce

usePagination

useLocalStorage

---

# shared/constants

Constantes globales.

Exemples :

Routes

Roles

API URLs

---

# Features

Chaque fonctionnalité possède sa propre organisation.

Exemple :

features/

products/

categories/

sales/

users/

dashboard/

auth/

---

# Structure d'une feature

Chaque feature suit la même organisation.

Exemple :

products/

api/

components/

hooks/

pages/

services/

types/

---

# api/

Communication avec le backend.

Exemple :

productApi.js

Toutes les requêtes HTTP concernant les produits sont centralisées ici.

---

# components/

Composants spécifiques à la feature.

Exemples :

ProductCard

ProductTable

ProductForm

ProductModal

---

# pages/

Pages de la feature.

Exemples :

ProductsPage

ProductDetailsPage

---

# hooks/

Hooks propres à la feature.

Exemples :

useProducts

useProductDetails

---

# services/

Logique de présentation.

Aucune logique métier.

Uniquement des traitements liés à l'interface.

---

# types/

Types TypeScript ou définitions JSDoc.

Préparation à une future migration TypeScript.

---

# Routage

Le routage est centralisé.

Exemple :

/

/login

/dashboard

/products

/products/:id

/categories

/users

/sales

/sales/new

/sales/:id

---

# Communication avec le backend

Toutes les communications passent par :

shared/api/

Chaque feature appelle son propre client API.

Exemple :

Product API

↓

/api/v1/products

Sale API

↓

/api/v1/sales

Dashboard API

↓

/api/v1/dashboard

Le frontend ne construit jamais les URLs directement dans les composants.

---

# Gestion de l'état

Principe :

Local avant Global.

Ordre de priorité :

1. useState

2. useReducer

3. Context API

Aucun store global (Redux, Zustand…) ne sera introduit tant que le besoin réel n'est pas identifié.

---

# Authentification

MVP

Session HTTP.

V1

JWT.

Le token sera stocké de manière sécurisée.

Les appels API passeront par un interceptor Axios.

---

# Philosophie

Le frontend ne connaît pas les entités JPA.

Il manipule uniquement les DTO exposés par l'API REST.

Le backend reste l'unique source de vérité.

---

# Préparation SaaS

L'architecture est conçue pour intégrer progressivement :

Company

Store

Subscription

Supplier

Stock Transfer

Cash Remittance

sans modifier l'organisation générale du frontend.

Chaque nouvelle fonctionnalité sera ajoutée sous forme d'une nouvelle feature.

---

# Vision

Le frontend React constitue l'interface utilisateur de la plateforme.

Le backend Spring Boot constitue le moteur métier.

Cette séparation garantit une architecture évolutive, maintenable et compatible avec les futures versions SaaS du projet.