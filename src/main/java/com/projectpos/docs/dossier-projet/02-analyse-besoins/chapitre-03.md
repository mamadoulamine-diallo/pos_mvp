# 3. Analyse des besoins

## 3.1 Identification des acteurs

L’analyse du besoin a permis d’identifier plusieurs acteurs principaux concernés par l’utilisation de l’application.

Le premier acteur est le vendeur. Il utilise l’application au quotidien pour consulter les produits disponibles, enregistrer les ventes et générer un reçu. Son besoin principal est de réaliser une vente rapidement, avec le moins de manipulations possible.

Le deuxième acteur est le gérant. Il supervise l’activité du commerce, gère les produits, les catégories, les utilisateurs et consulte les indicateurs du tableau de bord. Il a besoin d’une vision synthétique de l’activité afin de piloter le commerce plus efficacement.

Le troisième acteur est l’associé ou propriétaire distant. Il n’intervient pas nécessairement dans les opérations quotidiennes, mais il souhaite consulter les ventes, le stock et les indicateurs principaux afin de disposer d’une information fiable sur l’activité du commerce.

## 3.2 Besoins fonctionnels

Les besoins fonctionnels correspondent aux actions que l’application doit permettre de réaliser.

L’application doit permettre l’authentification des utilisateurs afin de contrôler l’accès aux fonctionnalités. Chaque utilisateur dispose d’un code PIN et d’un rôle permettant de différencier les droits d’accès.

Elle doit également permettre la gestion des utilisateurs : création, modification, activation et désactivation. Cette fonctionnalité est nécessaire pour adapter l’accès à l’application selon les personnes travaillant dans le commerce.

La gestion des produits constitue un besoin central. Le gérant doit pouvoir créer, modifier, rechercher, activer ou désactiver un produit. Chaque produit est rattaché à une catégorie, possède un stock et un prix actif.

La gestion des catégories permet d’organiser le catalogue de produits et de faciliter la recherche lors de la vente.

L’application doit aussi permettre l’historisation des prix. Lorsqu’un prix est modifié, l’ancien prix n’est pas supprimé mais conservé dans l’historique. Cette approche permet de garder une trace des évolutions tarifaires.

La gestion des ventes doit permettre au vendeur de sélectionner des produits, constituer un panier, modifier les quantités, valider la vente et obtenir un reçu. Une vente validée doit décrémenter automatiquement le stock des produits concernés.

Enfin, le tableau de bord doit fournir une synthèse de l’activité commerciale : chiffre d’affaires, nombre de ventes, articles vendus, panier moyen, produits les plus vendus, ventes récentes, stocks faibles et ruptures.

## 3.3 Besoins non fonctionnels

Au-delà des fonctionnalités, plusieurs besoins non fonctionnels ont été identifiés.

L’application doit être simple à utiliser. Les utilisateurs visés ne sont pas nécessairement des profils techniques. L’interface doit donc rester lisible, directe et adaptée à une utilisation quotidienne.

La rapidité est également un critère important. Une vente doit pouvoir être enregistrée rapidement afin de ne pas ralentir l’activité du commerce.

L’application doit être adaptée à un usage tactile sur tablette ou ordinateur. Les boutons, cartes produits, menus et actions principales ont été pensés pour une utilisation confortable dans un contexte de point de vente.

La maintenabilité du code est un autre besoin important. Le projet doit pouvoir évoluer vers une version plus avancée. Pour cette raison, l’application a été organisée selon une architecture modulaire et une séparation claire des responsabilités.

La sécurité est également prise en compte. L’accès à l’application est contrôlé par authentification, les utilisateurs disposent de rôles, et les données sensibles telles que le code PIN sont soumises à des contraintes d’unicité.

## 3.4 Contraintes du projet

Le projet doit répondre à plusieurs contraintes.

La première contrainte est liée au contexte d’utilisation. L’application vise des commerces de petite ou moyenne taille, avec des utilisateurs qui recherchent avant tout un outil simple, rapide et fiable.

La deuxième contrainte est technique. Le projet étant réalisé dans le cadre de la formation CDA, il doit démontrer des compétences en analyse, conception, développement, base de données, architecture, sécurité, tests et déploiement.

La troisième contrainte concerne le périmètre. Le MVP devait rester réaliste afin d’être terminé, testé et stabilisé. Certaines fonctionnalités comme le paiement intégré, la gestion multi-boutiques, l’application mobile native ou les microservices complets ont donc été volontairement repoussées à une version ultérieure.

## 3.5 User stories principales

Plusieurs user stories ont été définies pour guider la conception fonctionnelle du projet.

En tant que vendeur, je souhaite m’authentifier rapidement afin d’accéder à l’écran de vente.

En tant que vendeur, je souhaite ajouter un produit au panier en un clic afin d’enregistrer une vente rapidement.

En tant que vendeur, je souhaite modifier les quantités dans le panier afin d’adapter la vente à la demande du client.

En tant que gérant, je souhaite créer et modifier des produits afin de maintenir le catalogue à jour.

En tant que gérant, je souhaite modifier les prix des produits afin d’adapter les tarifs à l’évolution du commerce.

En tant que gérant, je souhaite consulter les stocks faibles et les ruptures afin d’anticiper les réapprovisionnements.

En tant que propriétaire ou associé distant, je souhaite consulter le tableau de bord afin de suivre l’activité commerciale sans être présent physiquement dans le commerce.

## 3.6 Synthèse des besoins

L’analyse des besoins montre que le projet doit répondre à un double objectif.

Le premier objectif est opérationnel : permettre aux vendeurs et gérants de gérer les ventes, les produits et le stock de manière simple et rapide.

Le second objectif est décisionnel : fournir une meilleure visibilité sur l’activité commerciale grâce à des données centralisées et consultables depuis le tableau de bord.

Ces besoins ont conduit à la conception d’un MVP centré sur les fonctionnalités essentielles, tout en préparant une évolution progressive vers une architecture plus complète.
