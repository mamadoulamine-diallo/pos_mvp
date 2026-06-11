# POS MVP – Plateforme de Gestion Commerciale

## Présentation

POS MVP est une application de gestion commerciale développée dans le cadre du titre professionnel Concepteur Développeur d'Applications (CDA).

Le projet est né d’un constat observé dans de nombreux commerces d’Afrique de l’Ouest où la gestion quotidienne repose encore largement sur des cahiers papier, rendant difficile le suivi des ventes, du stock et de l’activité lorsqu’un commerce est géré à distance.

L’objectif du projet est de proposer une solution simple, rapide et accessible permettant à un commerçant de :

* gérer son catalogue produits ;
* suivre son stock ;
* enregistrer ses ventes ;
* consulter ses indicateurs commerciaux ;
* superviser son activité en temps réel.

L’application a été pensée en priorité pour une utilisation sur tablette tactile, tout en restant pleinement compatible desktop.

---

## Fonctionnalités

### Authentification

* Connexion par code PIN
* Gestion des rôles
* Gestion des sessions
* Déconnexion sécurisée

### Gestion des utilisateurs

* Création d’utilisateurs
* Modification des utilisateurs
* Activation / désactivation
* Gestion des rôles :

    * Gérant
    * Vendeur

### Gestion des catégories

* Création de catégories
* Modification des catégories
* Activation / désactivation
* Filtrage dynamique

### Gestion des produits

* Création de produits
* Modification de produits
* Activation / désactivation
* Images produits
* Association à une catégorie

### Gestion des prix

* Historisation complète des prix
* Prix actif unique
* Prix d’achat
* Prix de vente
* Consultation de l’historique

### Gestion du stock

* Quantité disponible
* Ajout de stock
* Alertes stock faible
* Alertes rupture

### Gestion des ventes

* Création de ventes
* Panier dynamique
* Validation des ventes
* Génération de reçu
* Historique des ventes
* Détail complet d’une vente

### Dashboard

* Chiffre d’affaires
* Nombre de ventes
* Quantité vendue
* Produits les plus vendus
* Revenus par période
* Ventes récentes
* Notifications de stock

---

## Architecture

Architecture en couches :

Controller
↓
Service
↓
Repository
↓
Base de données

Organisation modulaire :

* user
* product
* category
* sale
* dashboard
* shared

---

## Stack Technique

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* Maven

### Base de données

* MySQL

### Frontend

* HTML5
* SCSS / CSS
* JavaScript ES6
* Thymeleaf

### Outils

* Git
* GitHub
* IntelliJ IDEA
* Figma
* PlantUML

---

## Modèle de données

Principales entités :

* User
* Category
* Product
* ProductPrice
* Sale
* SaleItem

---

## Installation

### Cloner le projet

git clone <repository>

### Configurer MySQL

Créer une base :

project_pos

### Configuration

Modifier :

application.properties

### Lancer

mvn spring-boot:run

---

---

## Roadmap

### MVP

* Authentification
* Produits
* Stock
* Ventes
* Dashboard

### V1

* Frontend React
* API REST complète
* Architecture microservices
* Multi-boutiques
* SaaS multi-tenant
* Gestion avancée des utilisateurs
* Supervision commerciale à distance

---

## Auteur

Mamadou Lamine Diallo

Projet réalisé dans le cadre du titre professionnel CDA.
