# 11. Migration vers la V1 : API REST et React

## 11.1 Objectifs de la migration

Après la stabilisation du MVP, une première évolution de l'architecture a été engagée afin de séparer progressivement l'interface utilisateur de la logique métier.

Le MVP reposait sur une architecture Spring MVC dans laquelle Spring Boot assurait à la fois le traitement métier, l'accès aux données et le rendu des interfaces avec Thymeleaf.

Cette architecture était adaptée à la validation rapide du besoin métier, mais elle limitait l'indépendance entre le frontend et le backend.

La V1 a donc poursuivi plusieurs objectifs :

- conserver les règles métier validées pendant le MVP ;
- exposer les fonctionnalités du backend à travers une API REST ;
- remplacer progressivement les vues Thymeleaf par une interface React ;
- préparer le backend à une future architecture distribuée ;
- limiter les risques liés à une réécriture complète de l'application.

La migration a ainsi été réalisée comme une évolution progressive du MVP et non comme un nouveau développement indépendant.

---

## 11.2 Conservation du socle métier

L'un des choix importants de cette migration a été de conserver autant que possible les composants métier déjà validés.

Les entités principales restent notamment :

- `AppUser` ;
- `Category` ;
- `Product` ;
- `ProductPrice` ;
- `Sale` ;
- `SaleItem`.

Les règles métier essentielles ont également été conservées.

Une vente reste associée à un utilisateur.

Une catégorie peut contenir plusieurs produits.

Un produit possède un stock et un historique de prix.

Lorsqu'une vente est réalisée, le prix unitaire du produit est enregistré dans la ligne de vente afin que l'historique reste cohérent même si le prix du produit évolue ultérieurement.

Cette stratégie a permis de capitaliser sur le travail réalisé pendant le MVP plutôt que de réécrire des règles déjà testées.

---

## 11.3 Mise en place de l'API REST

La première étape technique de la migration a consisté à exposer les principales fonctionnalités du backend à travers une API REST.

Des contrôleurs REST ont progressivement été ajoutés pour les domaines principaux de l'application.

L'API permet notamment de gérer :

- les produits ;
- les catégories ;
- les utilisateurs ;
- l'authentification ;
- les prix ;
- le stock ;
- les ventes.

Les échanges entre le frontend et le backend reposent sur des représentations JSON.

L'utilisation de DTO permet de contrôler les données exposées par l'API et d'éviter de transmettre directement les entités de persistance.

Par exemple, les opérations concernant les produits disposent de requêtes spécifiques pour :

- créer un produit ;
- modifier un produit ;
- changer son prix ;
- ajouter du stock.

Cette organisation rend les responsabilités de l'API plus explicites et prépare également le découpage ultérieur des fonctionnalités en services indépendants.

---

## 11.4 Évolution de l'interface avec React

La séparation du backend a permis d'introduire React pour la nouvelle interface utilisateur.

L'objectif n'était pas uniquement de remplacer Thymeleaf par une autre technologie, mais de rendre le frontend indépendant du moteur de rendu du serveur.

React communique désormais avec le backend à travers les endpoints REST.

L'application frontend comprend notamment les parcours suivants :

- authentification ;
- accueil ;
- consultation et gestion des produits ;
- consultation d'un produit ;
- gestion des catégories ;
- création d'une vente ;
- consultation de l'historique des ventes ;
- consultation du détail d'une vente ;
- gestion des utilisateurs.

Cette organisation permet de faire évoluer l'expérience utilisateur sans modifier directement les vues du backend.

Elle prépare également l'application à d'autres types de clients, par exemple une application mobile ou une interface dédiée à certaines fonctions de gestion.

---

## 11.5 Authentification et gestion de session

Pour la V1, le mécanisme d'authentification repose volontairement sur une session HTTP.

L'utilisateur s'authentifie à l'aide de son code PIN.

Après validation, le serveur conserve l'utilisateur authentifié dans la session et le frontend peut interroger le backend afin de connaître l'utilisateur courant.

Ce choix permet de conserver un mécanisme simple et adapté au contexte actuel de l'application tout en séparant le frontend et le backend.

Une authentification par jetons, par exemple avec JWT, pourrait être envisagée dans une évolution future si les contraintes de déploiement ou de distribution du système le nécessitent.

Le choix a donc été fait de ne pas complexifier prématurément la sécurité tant que le besoin ne le justifie pas.

---

## 11.6 Continuité entre le MVP et la V1

La migration vers la V1 illustre la stratégie progressive retenue depuis le début du projet.

Le MVP a permis de valider les fonctionnalités et les règles métier.

La V1 a ensuite permis de faire évoluer l'architecture sans remettre en cause ce socle fonctionnel.

La trajectoire peut être représentée de la manière suivante :

MVP :

`Spring Boot + Spring MVC + Thymeleaf + MySQL`

↓

V1 :

`React → API REST Spring Boot → MySQL`

Cette transition a permis de réduire le couplage entre l'interface utilisateur et le backend.

Elle a également constitué une étape intermédiaire importante avant le passage à l'architecture microservices.

---

## 11.7 Préparation de l'architecture V2

La mise en place de l'API REST a facilité l'identification des principaux domaines fonctionnels de l'application.

Les responsabilités peuvent notamment être regroupées autour de plusieurs domaines :

- utilisateurs et authentification ;
- catalogue produit et tarification ;
- ventes ;
- traçabilité des activités.

Cette séparation a servi de base à la conception de la V2.

La V2 ne constitue donc pas une rupture complète avec les versions précédentes.

Elle reprend les règles métier validées dans le MVP et les contrats introduits pendant la V1, puis les répartit dans une architecture distribuée.

Cette progression permet de maîtriser la complexité technique tout en conservant la continuité fonctionnelle du produit.

---

## 11.8 Bilan de la migration

La migration vers la V1 a constitué une étape structurante dans l'évolution de PROJECT_POS.

Elle a permis de passer d'une application monolithique assurant à la fois le rendu des vues et les traitements métier à une architecture dans laquelle le frontend et le backend communiquent à travers une API REST.

Cette évolution a permis :

- de préserver les règles métier validées pendant le MVP ;
- de moderniser l'interface avec React ;
- de clarifier les contrats entre frontend et backend ;
- de réduire le couplage entre la présentation et la logique métier ;
- de préparer le découpage du système en microservices.

La V1 constitue ainsi une architecture de transition entre le MVP monolithique et la V2 distribuée présentée dans le chapitre suivant.