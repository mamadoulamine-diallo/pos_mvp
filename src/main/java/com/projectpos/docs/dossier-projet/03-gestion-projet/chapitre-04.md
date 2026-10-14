# 4. Gestion de projet

## 4.1 Organisation et démarche

PROJECT_POS a été développé dans le cadre de la préparation du titre professionnel Concepteur Développeur d'Applications (CDA), à partir d'un besoin métier identifié auprès de commerces utilisant encore des outils manuels pour suivre les ventes et les stocks.

Le projet a suivi une démarche **itérative et incrémentale** : construire d'abord un MVP fonctionnel, séparer ensuite le frontend et le backend, puis expérimenter une architecture distribuée. Ce découpage a permis de conserver un socle métier exploitable tout en introduisant progressivement de nouvelles contraintes techniques.

Pour chaque fonctionnalité, le travail s'est organisé autour d'un cycle court : analyse du besoin, conception, implémentation, vérification et correction. Les endpoints REST ont notamment été vérifiés avec Postman au cours de leur développement. Cette organisation s'inspire des pratiques agiles, sans prétendre à l'application formelle d'un cadre Scrum.

## 4.2 Phases de réalisation

| Phase | Objectif | Réalisations principales | Repère |
|---|---|---|---|
| **MVP — Monolithe** | Valider les processus métier essentiels | Authentification par PIN, catalogue, catégories, prix historisés, ventes, stock, tableau de bord ; Spring Boot, Thymeleaf et MySQL | Tag `v1.0-mvp` |
| **V1 — API REST et React** | Séparer l'interface de la logique métier | Exposition d'API REST, utilisation de DTO, consommation des API par React, conservation des services métier Spring Boot | Branche `v1-preparation` et travaux V1 |
| **V2 — Microservices** | Étudier les contraintes d'une architecture distribuée | Découpage des services métier, échanges REST/OpenFeign, découverte avec Consul, configuration centralisée, Docker Compose, persistance SQL et MongoDB | Réalisation et validation technique présentées aux chapitres 12 à 15 |

La progression du projet n'a pas consisté à reconstruire l'application à chaque étape. Les règles métier élaborées dans le MVP ont servi de base à l'API REST, puis au découpage en services. En revanche, la V2 a nécessité de revoir les communications et la gestion des données, puisqu'une transaction SQL locale ne couvre plus plusieurs services indépendants.

## 4.3 Gestion du code source

Le code est versionné avec **Git** et hébergé sur **GitHub**. La branche `main` et le tag `v1.0-mvp` permettent d'identifier le socle stabilisé du MVP. La branche `v1-preparation` a servi aux travaux préparatoires de l'API REST et de React.

Les modifications ont été réalisées par étapes, avec des vérifications fonctionnelles ou techniques avant leur intégration. Le versionnement a permis de conserver des points de référence et de distinguer les évolutions successives de l'application.

## 4.4 Outils et livrables

| Domaine | Outils et technologies mobilisés |
|---|---|
| Backend | Java 21, Spring Boot, Maven, Spring Data JPA |
| Frontend | Thymeleaf, HTML, Sass, JavaScript, React |
| Données | MySQL, MongoDB |
| Architecture et exécution | Spring Cloud, OpenFeign, Consul, Docker Compose |
| Vérification et intégration | Postman, JUnit, Mockito, GitHub Actions |
| Conception et suivi | Git, GitHub, Markdown, diagrammes UML et MERISE |

Les livrables sont organisés par étapes : application MVP, API et interface V1, services et infrastructure V2, puis documentation technique et preuves de validation. Les chapitres suivants détaillent les choix de conception, les extraits de code et les résultats obtenus.

## 4.5 Bilan de l'organisation

Le découpage en trois phases a permis de répondre d'abord au besoin métier, puis d'approfondir progressivement les compétences attendues en conception et développement d'applications. Il a également facilité l'identification des limites de chaque architecture, en particulier la cohérence des données dans la V2 distribuée.

Cette démarche distingue les fonctionnalités réalisées, les mécanismes effectivement vérifiés et les améliorations encore envisagées pour une exploitation commerciale à plus grande échelle.
