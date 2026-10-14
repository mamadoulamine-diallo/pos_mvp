# 16. Bilan du projet, limites et perspectives d'évolution

## 16.1 Bilan général du projet

PROJECT_POS est né d'un besoin métier réel : améliorer la gestion des ventes, des produits et des stocks dans de petites structures commerciales utilisant encore des méthodes manuelles, notamment les cahiers et les échanges WhatsApp.

L'objectif initial était de concevoir une application de caisse simple, rapide et adaptée aux conditions d'utilisation des commerçants.

Le projet a progressivement évolué vers une plateforme de gestion commerciale reposant sur une architecture distribuée.

Cette évolution s'est organisée autour de trois grandes étapes.

| Version | Objectif principal | Réalisations |
|---|---|---|
| **MVP** | Valider les fonctionnalités essentielles d'une caisse commerciale | Application monolithique Spring Boot, interface Thymeleaf, gestion des produits, prix, ventes, stocks et tableau de bord |
| **V1** | Séparer progressivement l'interface utilisateur et le backend | Développement d'API REST, structuration des DTO et préparation d'une interface React |
| **V2** | Faire évoluer l'architecture vers des microservices | Services métier indépendants, API Gateway, Consul, Config Server, bases SQL et NoSQL, tests automatisés et intégration continue |

Cette progression a permis de conserver les acquis fonctionnels du MVP tout en faisant évoluer l'organisation technique de l'application.

**Le passage aux microservices n'a pas constitué une simple modification technologique : il a nécessité de repenser la répartition des responsabilités, les communications entre composants et la gestion des données.**

La V2 représente aujourd'hui un socle technique validé dans un environnement local de développement et de test. Elle ne constitue pas encore une plateforme de production entièrement industrialisée.

## 16.2 Résultats techniques obtenus

Les travaux réalisés ont permis de couvrir les principales dimensions d'une application distribuée : conception, développement, persistance, communication, sécurité, validation et préparation au déploiement.

### 16.2.1 Architecture applicative

L'architecture V2 repose sur quatre microservices métier :

- `user-service` : gestion des utilisateurs et de l'authentification ;
- `product-service` : gestion des produits, des prix et des stocks ;
- `sale-service` : gestion des ventes et de leurs lignes ;
- `activity-service` : enregistrement des événements importants de l'application.

Ces services sont complétés par une API Gateway, un Config Server et Consul pour la découverte des services.

Les communications interservices utilisent principalement des API REST et OpenFeign.

Chaque domaine métier possède son propre périmètre de données, ce qui limite les dépendances directes entre les bases.

### 16.2.2 Persistance SQL et NoSQL

La V2 associe deux modèles de persistance complémentaires.

**MySQL** est utilisé pour les données transactionnelles structurées : utilisateurs, produits, prix, stocks et ventes.

**MongoDB** est utilisé pour le journal d'activité, dont les événements peuvent contenir des métadonnées variables selon leur nature.

Cette organisation permet de choisir le modèle de stockage en fonction des caractéristiques des données et des besoins métier.

Elle introduit néanmoins de nouvelles contraintes de cohérence lorsque plusieurs services participent à une même opération.

### 16.2.3 Validation technique

La validation du projet repose sur plusieurs niveaux de vérification.

| Domaine | Résultat documenté |
|---|---|
| Infrastructure Docker | 6 conteneurs sur 6 déclarés `healthy` |
| Découverte des services | 5 applications enregistrées dans Consul |
| Tests automatisés | 22 tests ciblés documentés |
| Tests fonctionnels | Parcours REST validés avec Postman |
| Sécurité | Vérification du rejet d'une opération protégée sans session |
| Tests de charge | Deux campagnes locales sans échec relevé |
| Intégration continue | 6 jobs Maven réussis sur 6 avec GitHub Actions |

Ces résultats démontrent le fonctionnement des composants et de plusieurs parcours métier dans l'environnement testé.

Ils ne constituent pas une garantie de disponibilité, de performance ou de sécurité en production.

**L'un des principaux acquis du projet est la mise en place d'une démarche de validation reproductible, associant tests automatisés, vérifications fonctionnelles et intégration continue.**

## 16.3 Difficultés rencontrées et solutions apportées

La réalisation de PROJECT_POS a nécessité de résoudre plusieurs problèmes techniques, notamment lors du passage du monolithe à l'architecture distribuée.

Ces difficultés ont contribué à améliorer la conception et à approfondir la compréhension des mécanismes utilisés.

| Difficulté | Solution ou décision technique | Enseignement |
|---|---|---|
| Contrainte d'unicité sur les prix actifs | Clôture de l'ancien prix et synchronisation avant création du nouveau | Importance de l'ordre des opérations de persistance |
| Communication entre microservices | Utilisation d'OpenFeign, Consul et de la Gateway | Nécessité de vérifier les parcours distribués |
| Route manquante vers `activity-service` | Ajout du routage dans l'API Gateway | Un service fonctionnel isolément ne garantit pas son accessibilité |
| Dépendances aux bases locales pendant les tests | Profil de test et base H2 en mémoire | Importance de l'isolation des environnements |
| Différences entre Windows et Linux | Adaptation des permissions du Maven Wrapper | Nécessité de garantir la portabilité des builds |
| Dépendance à une configuration distante | Adaptation du Config Server pour les tests | Importance de maîtriser les dépendances externes |

La résolution de ces incidents a permis d'améliorer progressivement la fiabilité et la reproductibilité du projet.

Elle a également montré qu'une architecture microservices exige davantage de contrôles qu'une application monolithique, en raison de la multiplication des composants et des communications réseau.

## 16.4 Compétences mobilisées dans le cadre du titre CDA

La réalisation de PROJECT_POS a permis de mobiliser plusieurs compétences relevant du métier de Concepteur Développeur d'Applications.

Le projet ne se limite pas au développement de fonctionnalités : il couvre également l'analyse du besoin, la conception de l'architecture, l'organisation des données, la validation et la préparation de la livraison.

| Domaine de compétence | Mise en application dans PROJECT_POS |
|---|---|
| Analyse et conception | Identification des besoins commerciaux, règles métier, modélisation des entités et découpage fonctionnel |
| Développement backend | Services Java 21 et Spring Boot, contrôleurs REST, DTO, logique métier et gestion des exceptions |
| Développement frontend | Interfaces HTML, CSS, JavaScript et Thymeleaf du MVP ; préparation de l'évolution React |
| Bases de données relationnelles | Modélisation et exploitation de MySQL avec Spring Data JPA |
| Bases de données NoSQL | Persistance des événements d'activité avec MongoDB |
| Architecture applicative | Passage d'un monolithe modulaire à des microservices |
| Sécurité applicative | Authentification, contrôles d'accès, validation des données et externalisation des secrets |
| Tests et qualité | JUnit 5, Mockito, Maven, Postman et tests de charge locaux |
| Déploiement et DevOps | Docker Compose, contrôles de santé et GitHub Actions |
| Documentation technique | Documentation d'architecture, procédures de validation et suivi des évolutions |

Le projet a également nécessité des compétences transversales : autonomie, analyse des anomalies, recherche de solutions, organisation du travail et justification des choix techniques.

**L'apport principal de cette démarche est d'avoir relié les compétences techniques à un besoin métier concret, plutôt que de développer des fonctionnalités uniquement dans un objectif pédagogique.**

## 16.5 Limites de l'architecture actuelle

Malgré les résultats obtenus, plusieurs limites doivent être prises en compte avant d'envisager une exploitation commerciale à plus grande échelle.

### 16.5.1 Cohérence des transactions distribuées

Dans la V2, la création d'une vente peut nécessiter des opérations sur plusieurs services et bases de données indépendantes.

Une modification du stock peut ainsi réussir alors que l'enregistrement de la vente échoue.

L'architecture actuelle ne garantit pas une transaction SQL atomique couvrant l'ensemble de ces opérations.

Cette limite, étudiée au chapitre 12, constitue un point important pour une future exploitation commerciale.

Des mécanismes tels que **Saga, les opérations compensatoires ou l'Outbox Pattern** pourraient être étudiés afin de renforcer la cohérence des traitements distribués.

### 16.5.2 Fiabilité des événements d'activité

L'enregistrement des événements dans `activity-service` est secondaire par rapport à certaines opérations métier.

Cette décision permet notamment de ne pas bloquer un changement de prix lorsque le service de journalisation est indisponible.

En revanche, elle ne garantit pas que tous les événements soient conservés en cas de panne.

Une évolution pourrait introduire une publication fiable des événements, associée à un système de messagerie et à des mécanismes de reprise.

### 16.5.3 Sécurité et gestion des accès

La sécurité actuelle répond aux besoins de développement et aux scénarios fonctionnels testés.

Une exploitation en production nécessiterait cependant des mécanismes complémentaires, notamment :

- une politique d'authentification et d'autorisation adaptée à plusieurs établissements ;
- la sécurisation des communications avec HTTPS ;
- une gestion centralisée et sécurisée des secrets ;
- une politique de journalisation et d'audit des accès ;
- des contrôles de sécurité automatisés plus approfondis.

Ces évolutions devront être adaptées au niveau de risque et aux conditions réelles d'exploitation.

### 16.5.4 Déploiement et exploitation

La V2 fonctionne principalement dans un environnement local de développement et de validation.

La chaîne GitHub Actions assure l'intégration continue, mais ne réalise pas encore de déploiement automatique vers un environnement distant.

La supervision reste également limitée par rapport aux exigences d'une plateforme commerciale en production.

Les évolutions nécessaires concernent notamment la construction d'images applicatives, le déploiement distant, la centralisation des logs, les métriques, les sauvegardes et les procédures de restauration.

## 16.6 Perspectives d'évolution

La suite de PROJECT_POS doit être guidée par les besoins réels des commerçants et par la capacité à maintenir une application fiable.

L'objectif n'est pas de multiplier les technologies, mais de faire évoluer progressivement le produit vers une solution commerciale exploitable.

Les perspectives sont organisées selon trois horizons.

| Horizon | Évolutions envisagées | Objectif |
|---|---|---|
| **Court terme** | Finalisation de l'interface React, amélioration des parcours utilisateurs, tests complémentaires et stabilisation de la V2 | Disposer d'une application cohérente et démontrable de bout en bout |
| **Moyen terme** | Transactions distribuées plus fiables, gestion des événements, sécurité renforcée, déploiement distant et observabilité | Préparer une exploitation plus robuste |
| **Long terme** | Gestion multi-boutiques, supervision centralisée, traçabilité financière, indicateurs commerciaux et gestion avancée des stocks | Faire évoluer PROJECT_POS vers une plateforme de pilotage commercial |

### 16.6.1 Gestion multi-boutiques

Une évolution majeure consisterait à permettre à un même responsable de superviser plusieurs points de vente.

Chaque établissement disposerait de ses propres utilisateurs, stocks et opérations commerciales, tout en alimentant une vision consolidée.

Cette fonctionnalité nécessiterait une évolution du modèle de données, des droits d'accès et des mécanismes d'isolation entre établissements.

### 16.6.2 Traçabilité des flux financiers

Au-delà de l'enregistrement des ventes, les besoins métier initiaux font apparaître l'importance du suivi des encaissements et des versements.

Une future version pourrait intégrer la distinction entre les ventes réalisées, les montants effectivement encaissés et les sommes reversées.

Cette évolution permettrait d'améliorer la transparence des opérations commerciales et de faciliter le rapprochement des flux financiers.

### 16.6.3 Supervision et indicateurs de gestion

Le tableau de bord du MVP constitue une première base de suivi commercial.

À terme, PROJECT_POS pourrait proposer des indicateurs consolidés sur les ventes, les stocks, les marges, les performances par établissement et les écarts constatés.

Ces fonctionnalités devront reposer sur des données suffisamment fiables et historisées pour produire des indicateurs exploitables.

**La valeur future de PROJECT_POS repose avant tout sur la fiabilité et la centralisation des informations commerciales, et non sur la complexité de son architecture technique.**

## 16.7 Bilan personnel et enseignements

La réalisation de PROJECT_POS a constitué une expérience complète de conception et de développement d'applications.

Le projet a permis de travailler sur un besoin concret, de formaliser des règles métier, de développer une première application fonctionnelle, puis d'en faire évoluer l'architecture.

Le passage aux microservices a représenté une étape particulièrement formatrice.

Il a nécessité de dépasser la logique d'une application unique pour aborder les problématiques de communication réseau, d'indépendance des données, de configuration distribuée et de résilience.

La mise en place des tests automatisés et de l'intégration continue a également fait évoluer la méthode de travail.

Les corrections techniques ont progressivement été accompagnées de vérifications permettant de limiter les risques de régression.

Cette démarche a renforcé plusieurs compétences essentielles : analyser un problème, identifier ses causes, proposer une solution, la tester et documenter les décisions prises.

Le projet a également permis de mieux comprendre les compromis d'architecture.

**Une solution techniquement plus distribuée n'est pas nécessairement plus adaptée à tous les contextes.** Le choix d'une architecture doit rester cohérent avec les besoins métier, les contraintes d'exploitation et les ressources disponibles.

Cette réflexion constitue un enseignement important du parcours de conception et de développement.

## 16.8 Conclusion générale

PROJECT_POS a permis de transformer un besoin de gestion commerciale en une application progressivement structurée, testée et documentée.

Le MVP a validé les fonctionnalités fondamentales d'une caisse commerciale. Les évolutions suivantes ont introduit des API REST, puis une architecture microservices séparant les responsabilités métier et les données.

La V2 a permis de mettre en œuvre des mécanismes de communication interservices, une persistance SQL et NoSQL, des tests automatisés et une chaîne d'intégration continue.

Les résultats obtenus constituent un socle technique cohérent, tout en laissant apparaître les limites à résoudre avant une exploitation en production.

Au-delà des technologies utilisées, ce projet démontre une démarche complète : **analyser un besoin, concevoir une solution, développer ses composants, vérifier leur fonctionnement, résoudre les anomalies et préparer les évolutions futures**.

PROJECT_POS représente ainsi à la fois un support concret de validation des compétences du titre Concepteur Développeur d'Applications et la première étape d'un projet logiciel destiné à répondre à des besoins réels de gestion et de supervision commerciale.