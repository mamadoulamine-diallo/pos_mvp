# 4. Gestion de projet

## 4.1 Organisation générale du projet

Le projet POS Platform a été réalisé dans le cadre de la préparation du titre professionnel Concepteur Développeur d’Applications (CDA).

Dès le lancement du projet, une approche progressive a été privilégiée afin de limiter les risques techniques et de concentrer les efforts sur la validation du besoin métier.

L’objectif n’était pas de construire immédiatement une architecture complexe mais de développer une première version fonctionnelle permettant de vérifier la pertinence de la solution proposée.

Cette démarche a conduit à la réalisation d’un MVP (Minimum Viable Product) regroupant les fonctionnalités essentielles nécessaires à l’exploitation quotidienne d’un commerce.

## 4.2 Approche méthodologique

Le projet a été mené selon une approche itérative et incrémentale.

Chaque fonctionnalité a été développée par étapes successives :

Analyse du besoin

↓

Conception

↓

Développement

↓

Tests

↓

Validation

Cette organisation a permis de livrer progressivement des fonctionnalités opérationnelles tout en conservant une vision globale du produit.

L’approche retenue s’inspire des principes agiles, avec un développement orienté valeur métier et des validations régulières tout au long du projet.

## 4.3 Découpage du projet

Le projet a été structuré en plusieurs phases.

### Phase 1 : Validation métier

Objectif :

Construire un MVP permettant de répondre aux besoins essentiels des utilisateurs.

Fonctionnalités réalisées :

- authentification ;
- gestion des utilisateurs ;
- gestion des catégories ;
- gestion des produits ;
- historique des prix ;
- gestion des ventes ;
- suivi du stock ;
- tableau de bord.

Cette phase correspond à la version stabilisée du projet identifiée par le tag Git :

v1.0-mvp

### Phase 2 : Préparation de la V1

Objectif :

Faire évoluer l’application vers une architecture Frontend / Backend séparée.

Évolutions prévues :

- API REST ;
- React ;
- amélioration de la sécurité ;
- tests automatisés ;
- conteneurisation.

### Phase 3 : Vision V2

Objectif :

Préparer une architecture distribuée capable d’accompagner la croissance du produit.

Évolutions envisagées :

- microservices ;
- Spring Cloud ;
- Eureka ;
- OpenFeign ;
- MongoDB ;
- Docker Compose ;
- supervision avancée.

## 4.4 Gestion du code source

Le code source du projet est géré avec Git et hébergé sur GitHub.

Une stratégie simple de gestion des branches a été utilisée afin de sécuriser les développements.

Branche principale :

main

Cette branche contient les versions stables du projet.

Branche de préparation :

v1-preparation

Cette branche est utilisée pour préparer les évolutions futures du produit.

La version stable du MVP a été identifiée par le tag :

v1.0-mvp

Cette approche permet de conserver un historique clair des évolutions du projet et de faciliter le retour à une version stable si nécessaire.

## 4.5 Outils utilisés

Les principaux outils utilisés durant le projet sont :

### Développement

- Java 21
- Spring Boot
- Maven
- IntelliJ IDEA

### Base de données

- MySQL
- Spring Data JPA / Hibernate

### Frontend

- Thymeleaf
- HTML
- SCSS
- JavaScript ES Modules

### Gestion de version

- Git
- GitHub

### Documentation

- Markdown
- README
- Diagrammes UML et MERISE

## 4.6 Bilan de l'organisation du projet

L’approche progressive retenue a permis de sécuriser le développement du produit tout en conservant une vision à long terme.

La réalisation d’un MVP fonctionnel a facilité la validation des besoins métier avant d’envisager des évolutions architecturales plus ambitieuses.

Cette stratégie permet aujourd’hui d’aborder sereinement la migration vers une architecture moderne reposant sur une API REST, un frontend React et, à terme, une architecture distribuée basée sur des microservices.