# 7. Architecture du MVP

## 7.1 Objectifs de l'architecture

L’un des objectifs du projet était de construire une application stable, maintenable et évolutive tout en conservant un niveau de complexité adapté à un MVP.

L’architecture retenue devait permettre :

* une séparation claire des responsabilités ;
* une bonne lisibilité du code ;
* une maintenance facilitée ;
* une évolution progressive vers une architecture plus avancée ;
* une cohérence avec les bonnes pratiques du développement Java Spring.

Pour répondre à ces objectifs, le projet a été structuré selon une architecture en couches reposant sur le modèle MVC (Model View Controller).

---

## 7.2 Architecture générale

L’application repose sur une architecture classique composée de plusieurs couches.

```text
Interface utilisateur
        ↓
Controller
        ↓
Service
        ↓
Repository
        ↓
MySQL
```

Chaque couche possède une responsabilité clairement définie.

Cette séparation permet de limiter le couplage entre les composants et de faciliter les évolutions futures.

---

## 7.3 Couche présentation

La couche présentation est composée des vues Thymeleaf, du HTML, du SCSS et du JavaScript.

Elle est responsable :

* de l’affichage des données ;
* de l’interaction avec l’utilisateur ;
* de la navigation dans l’application ;
* de la validation visuelle des formulaires.

Les pages principales du MVP sont :

* tableau de bord ;
* gestion des produits ;
* gestion des ventes ;
* gestion des utilisateurs ;
* gestion des catégories ;
* détail des ventes ;
* détail des produits.

Cette approche permet de générer les pages directement côté serveur tout en conservant une interface dynamique grâce à JavaScript.

---

## 7.4 Couche contrôleur

Les contrôleurs constituent le point d’entrée de l’application.

Leur rôle est de :

* recevoir les requêtes HTTP ;
* valider les paramètres ;
* appeler les services métier ;
* préparer les données destinées aux vues.

Les contrôleurs ne contiennent pas de logique métier complexe.

Ils assurent uniquement la coordination entre l’interface utilisateur et les services applicatifs.

Cette séparation améliore la lisibilité du code et facilite les tests.

---

## 7.5 Couche service

La couche service constitue le cœur métier de l’application.

Elle contient les règles fonctionnelles nécessaires au bon fonctionnement du système.

Exemples :

* validation d’une vente ;
* calcul des indicateurs du tableau de bord ;
* gestion des utilisateurs ;
* gestion du stock ;
* activation ou désactivation d’un produit ;
* détermination du prix actif d’un produit.

Cette couche permet de centraliser les traitements métier et d’éviter leur duplication dans les contrôleurs.

---

## 7.6 Couche accès aux données

L’accès aux données est assuré par Spring Data JPA et Hibernate.

Les repositories sont responsables :

* de la lecture des données ;
* de la persistance des données ;
* des requêtes de recherche ;
* des agrégations utilisées par le tableau de bord.

Le choix de Spring Data JPA permet de réduire le code technique tout en conservant la possibilité d’écrire des requêtes personnalisées lorsque cela est nécessaire.

---

## 7.7 Base de données

La persistance des données repose sur MySQL.

Cette solution a été retenue pour plusieurs raisons :

* maturité ;
* fiabilité ;
* cohérence transactionnelle ;
* simplicité d’administration ;
* compatibilité avec Spring Boot.

Les données métier du MVP sont stockées dans les tables correspondant aux entités principales :

* AppUser ;
* Category ;
* Product ;
* ProductPrice ;
* Sale ;
* SaleItem.

La base de données constitue la source de vérité du système.

---

## 7.8 Organisation modulaire du code

Le projet est organisé par domaine métier.

Cette approche favorise la maintenabilité et facilite la compréhension du code.

Structure principale :

```text
com.projectpos

├── user
├── category
├── product
├── sale
├── dashboard
└── shared
```

Chaque domaine regroupe ses propres composants :

```text
controller
service
repository
entity
dto
```

Cette organisation limite les dépendances inutiles entre modules et prépare les futures évolutions du projet.

---

## 7.9 Choix d’un monolithe modulaire

Pour le MVP, le choix d’un monolithe modulaire a été privilégié.

Cette approche présente plusieurs avantages :

* simplicité de développement ;
* rapidité de mise en œuvre ;
* déploiement simplifié ;
* maintenance facilitée ;
* faible coût opérationnel.

Le choix d’une architecture microservices a volontairement été repoussé à une phase ultérieure afin de ne pas introduire une complexité injustifiée dès les premières étapes du projet.

Cette décision s’inscrit dans une démarche pragmatique consistant à valider d’abord le besoin métier avant d’investir dans une architecture distribuée.

---

## 7.10 Bilan architectural

L’architecture retenue a permis de construire un MVP stable, cohérent et maintenable.

La séparation des responsabilités entre les couches, l’organisation modulaire du code et l’utilisation des bonnes pratiques Spring constituent une base solide pour les futures évolutions du produit.

Cette architecture prépare naturellement la transition vers une API REST, un frontend React et, à plus long terme, une architecture distribuée basée sur des microservices.
