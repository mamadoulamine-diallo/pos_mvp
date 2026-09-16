# 8. Réalisation du MVP

## 8.1 Objectifs du MVP

L’objectif du MVP (Minimum Viable Product) était de développer une première version fonctionnelle de la solution permettant de valider les principaux besoins métier identifiés lors de l’analyse.

Cette version devait répondre à plusieurs objectifs :

* centraliser les données commerciales ;
* simplifier l’enregistrement des ventes ;
* améliorer le suivi du stock ;
* fournir une visibilité sur l’activité du commerce ;
* proposer une interface simple et adaptée à un usage quotidien.

Le périmètre fonctionnel a volontairement été limité afin de garantir la stabilité du produit et la maîtrise du projet.

---

## 8.2 Authentification et gestion des utilisateurs

La première fonctionnalité développée concerne l’authentification des utilisateurs.

Chaque utilisateur dispose d’un code PIN unique lui permettant d’accéder à l’application.

Le système permet :

* la connexion ;
* la déconnexion ;
* la gestion de session ;
* l’identification de l’utilisateur connecté.

Deux rôles sont actuellement disponibles :

* Gérant ;
* Vendeur.

Un module d’administration permet également :

* la création d’utilisateurs ;
* la modification d’utilisateurs ;
* l’activation ;
* la désactivation.

Cette fonctionnalité garantit la traçabilité des actions réalisées dans l’application.

---

## 8.3 Gestion des catégories

Le module catégories permet d’organiser le catalogue produit.

Les fonctionnalités développées sont :

* création d’une catégorie ;
* modification d’une catégorie ;
* activation ;
* désactivation.

Les catégories sont utilisées dans :

* le catalogue produit ;
* les filtres de recherche ;
* l’écran de vente.

Cette organisation améliore la lisibilité et facilite la navigation.

---

## 8.4 Gestion des produits

Le module produit constitue l’un des éléments centraux du MVP.

Il permet :

* la création d’un produit ;
* la modification d’un produit ;
* l’activation ;
* la désactivation ;
* l’ajout de stock ;
* la recherche ;
* le filtrage ;
* la consultation détaillée.

Chaque produit est associé à :

* une catégorie ;
* une quantité en stock ;
* une image ;
* un historique de prix.

L’interface permet également de distinguer :

* les produits actifs ;
* les produits inactifs ;
* les produits en stock faible ;
* les produits en rupture.

---

## 8.5 Historisation des prix

Afin de garantir la traçabilité des évolutions tarifaires, le projet intègre une entité dédiée à la gestion des prix.

Chaque produit possède un historique de prix permettant de conserver :

* le prix d’achat ;
* le prix de vente ;
* la période de validité.

Lorsqu’un nouveau prix est créé :

* l’ancien prix est clôturé ;
* le nouveau devient actif.

Cette approche permet de conserver l’historique complet des modifications et prépare la mise en place future d’analyses plus avancées.

---

## 8.6 Gestion des ventes

Le module vente représente le cœur opérationnel de l’application.

Le processus de vente repose sur plusieurs étapes :

1. Sélection des produits ;
2. Constitution du panier ;
3. Modification des quantités ;
4. Validation de la vente ;
5. Génération du reçu.

Lors de la validation :

* la vente est enregistrée ;
* les lignes de vente sont créées ;
* le stock est automatiquement décrémenté.

Chaque vente conserve :

* sa date ;
* son statut ;
* son utilisateur ;
* ses lignes de détail.

Cette approche permet d’assurer la traçabilité complète des transactions.

---

## 8.7 Historique des ventes

Le système conserve l’ensemble des ventes réalisées.

Les utilisateurs peuvent consulter :

* l’historique des ventes ;
* le détail d’une vente ;
* les produits vendus ;
* les quantités ;
* les montants.

Chaque vente est associée à l’utilisateur qui l’a enregistrée.

Cette fonctionnalité améliore la transparence et facilite les contrôles.

---

## 8.8 Tableau de bord

Le tableau de bord fournit une synthèse de l’activité commerciale.

Plusieurs indicateurs sont calculés dynamiquement :

* chiffre d’affaires ;
* nombre de ventes ;
* articles vendus ;
* panier moyen ;
* produits les plus vendus ;
* ventes récentes ;
* alertes de stock.

L’utilisateur peut également filtrer les données selon plusieurs périodes :

* aujourd’hui ;
* 7 derniers jours ;
* 30 derniers jours ;
* historique complet.

Cette fonctionnalité constitue un premier niveau de supervision commerciale.

---

## 8.9 Expérience utilisateur

Une attention particulière a été portée à l’ergonomie de l’application.

L’interface a été conçue afin de :

* limiter le nombre de clics ;
* faciliter les actions fréquentes ;
* rester lisible sur différents formats d’écran.

Les principaux éléments mis en place sont :

* navigation adaptée mobile et desktop ;
* formulaires en overlay ;
* système de notifications ;
* calculatrice intégrée ;
* filtres de recherche ;
* affichage cohérent des montants.

L’objectif était de proposer une expérience fluide et adaptée au contexte d’un point de vente.

---

## 8.10 Résultats obtenus

La réalisation du MVP a permis de valider l’ensemble des besoins fonctionnels identifiés lors de la phase d’analyse.

Le produit obtenu permet aujourd’hui :

* de gérer un catalogue de produits ;
* de suivre les stocks ;
* d’enregistrer des ventes ;
* de consulter des statistiques ;
* d’identifier les utilisateurs ;
* de centraliser les données commerciales.

Cette première version constitue une base fonctionnelle solide et démontre la faisabilité de la solution proposée.

Elle servira de fondation aux prochaines évolutions du projet, notamment la mise en place d’une API REST, d’un frontend React et d’une architecture distribuée.
