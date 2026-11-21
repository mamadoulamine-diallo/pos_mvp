# React Architecture — POS Platform V1

# Objectif

Ce document définit l'architecture officielle du frontend React de POS Platform V1.

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

- configuration React ;
- Router ;
- Providers ;
- configuration globale ;
- point d'entrée de l'application.

Exemples :

App.jsx

router.jsx

routes.jsx

providers.jsx

---

# assets/

Contient uniquement les ressources statiques.

Exemples :

- images
- logos
- fonts
- icons

---

# layouts/

Contient les layouts principaux de l'application.

Exemples :

MainLayout

AuthLayout

Les layouts définissent la structure générale de l'interface.

Ils ne contiennent aucune logique métier.

Les fonctionnalités sont affichées via React Router (`Outlet`).

---

# shared/

Contient tous les éléments réutilisables dans l'ensemble de l'application.

shared/

components/

hooks/

services/

utils/

constants/

types/

api/

---

# shared/components

Composants totalement génériques.

Ils ne contiennent aucune logique métier.

Exemples :

Button

Input

Modal

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

Le client Axios est centralisé.

Les composants React ne communiquent jamais directement avec Axios.

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

Exemples :

features/

dashboard/

products/

categories/

sales/

users/

auth/

Chaque feature représente un domaine métier indépendant.

---

# Structure d'une feature

Chaque feature suit la même organisation.

feature/

api/

components/

hooks/

pages/

services/

types/

widgets/ (optionnel)

---

# api/

Communication HTTP avec le backend.

Exemples :

productApi.js

saleApi.js

dashboardApi.js

Toutes les requêtes HTTP concernant une feature sont centralisées ici.

Les composants React n'effectuent jamais directement d'appels HTTP.

---

# services/

Les services préparent les données destinées à l'interface.

Ils ne contiennent aucune logique métier.

Exemples :

- formatage des données
- adaptation des réponses API
- préparation des données pour les graphiques
- agrégation d'informations destinées à l'affichage

---

# pages/

Les pages correspondent aux routes React.

Exemples :

ProductsPage

DashboardPage

SalesPage

UserPage

Une page orchestre les composants de sa feature.

Elle contient le moins de logique possible.

---

# components/

Composants spécifiques à une feature.

Ils ne sont pas réutilisés en dehors de leur domaine métier.

Exemples :

ProductCard

ProductTable

ProductForm

ProductModal

SaleCalculator

UserCard

---

# hooks/

Hooks propres à une feature.

Exemples :

useProducts

useDashboard

useSales

---

# types/

Définitions des modèles manipulés par React.

Aujourd'hui :

JSDoc si nécessaire.

Demain :

migration TypeScript.

Les types représentent les DTO exposés par l'API REST.

Jamais les entités JPA.

---

# widgets/

Le dossier widgets est optionnel.

Il est utilisé lorsqu'une feature est composée de plusieurs blocs métier indépendants.

Exemple :

dashboard/

widgets/

SummaryCards

RevenueChart

TopProducts

RecentSales

StockAlerts

Chaque widget représente une fonctionnalité autonome pouvant évoluer indépendamment.

Les widgets sont particulièrement adaptés aux dashboards.

---

# Hiérarchie des composants

Le frontend distingue trois niveaux de composants.

## 1. Shared Components

Réutilisables dans toute l'application.

Exemples :

Button

Modal

Card

Input

Badge

Loader

---

## 2. Feature Components

Réutilisables uniquement dans leur domaine métier.

Exemples :

ProductTable

SaleForm

UserCard

CategoryModal

---

## 3. Widgets

Blocs métier autonomes utilisés principalement dans les dashboards.

Exemple :

Revenue Widget

Stock Widget

Top Products Widget

Recent Sales Widget

Chaque widget peut évoluer indépendamment des autres.

---

# Routage

Le routage est centralisé.

Exemples :

/

login

products

products/:id

categories

sales

sales/new

sales/:id

users

Le Layout principal reste affiché.

Les pages sont injectées via React Router (`Outlet`).

---

# Communication avec le backend

Toutes les communications passent par :

shared/api/

Chaque feature possède ensuite son propre client API.

Exemple :

Dashboard API

↓

/api/v1/dashboard

↓

Dashboard Service

↓

Dashboard Page

Le frontend ne construit jamais directement les URLs.

Le flux est toujours :

Page

↓

Service

↓

API

↓

Backend

Les composants React n'utilisent jamais Axios directement.

---

# Gestion de l'état

Principe :

Local avant Global.

Ordre de priorité :

1. useState

2. useReducer

3. Context API

Aucun store global (Redux, Zustand...) ne sera introduit tant qu'un besoin réel n'est pas identifié.

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

Le frontend est considéré comme un client de la plateforme.

Il ne connaît jamais les entités JPA.

Il manipule uniquement les DTO exposés par l'API REST.

Le backend reste l'unique source de vérité.

Les règles métier sont implémentées exclusivement dans Spring Boot.

Le frontend est responsable de :

- l'affichage ;
- la navigation ;
- les interactions utilisateur ;
- la consommation de l'API REST.

---

# Préparation SaaS

L'architecture est conçue pour intégrer progressivement :

- Company
- Store
- Subscription
- Supplier
- Stock Transfer
- Cash Remittance
- Financial Flows
- Reports

sans modifier l'organisation générale du frontend.

Chaque nouveau domaine métier sera ajouté sous la forme d'une nouvelle feature.

---

# Vision

Le frontend React constitue l'interface utilisateur de POS Platform.

Le backend Spring Boot constitue le moteur métier.

Les deux applications évoluent indépendamment tout en partageant le même contrat REST.

Cette séparation garantit une architecture :

- évolutive ;
- maintenable ;
- testable ;
- compatible avec la future architecture SaaS multi-entreprises.

Le frontend n'est pas une simple interface.

Il est le client officiel de la plateforme POS Platform.