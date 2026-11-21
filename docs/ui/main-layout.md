# Main Layout — POS Platform

## Objectif

Le Main Layout constitue la structure principale de l'application.

Toutes les pages métier (Dashboard, Produits, Ventes, Utilisateurs...) seront affichées à l'intérieur de ce layout.

---

# Utilisateurs concernés

Le layout est conçu pour deux profils principaux :

- Vendeur
- Gérant

Le vendeur recherche la rapidité.

Le gérant recherche une vision globale de son activité.

L'interface doit répondre aux deux usages.

---

# Structure générale

+--------------------------------------------------------------------------+
| Logo             POS Platform                    Utilisateur connecté     |
+------------------+-------------------------------------------------------+
|                  |                                                       |
| Dashboard        |                                                       |
| Products         |                                                       |
| Categories       |                                                       |
| Sales            |                  Main Content                         |
| Users            |                                                       |
|                  |                                                       |
|------------------|                                                       |
| Settings         |                                                       |
| Logout           |                                                       |
+------------------+-------------------------------------------------------+

---

# Zones

## Header

Affiche :

- logo
- nom de la plateforme
- utilisateur connecté
- menu utilisateur

---

## Sidebar

Navigation principale.

Ordre des menus :

1 Dashboard

2 Products

3 Categories

4 Sales

5 Users

6 Settings

7 Logout

---

## Main Content

Affiche les pages métier.

Le contenu change selon la route.

---

# Principes UX

Navigation toujours visible.

Aucun écran ne doit nécessiter plus de trois clics pour atteindre une fonctionnalité.

Le contenu principal occupe la majorité de l'écran.

La navigation reste stable pendant toute la session.

---

# Responsive

Desktop

Sidebar fixe.

Tablet

Sidebar rétractable.

Mobile

Navigation via menu latéral.

---

# Évolutions futures

Le layout devra accueillir sans modification majeure :

- Companies
- Stores
- Suppliers
- Stock Transfers
- Financial Flows
- Reports
- Administration

Le menu restera organisé par domaines métier.