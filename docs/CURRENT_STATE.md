# PROJECT_POS — État d'avancement

**Date :** 21 novembre 2026  
**Phase :** Stabilisation de la V1  
**Branche locale :** `v1-stabilisation`

## 1. Objectif actuel

Transformer le MVP existant en une première version exploitable dans un commerce réel.

Le travail porte sur la fiabilité, la sécurité, l'expérience utilisateur et les fonctionnalités métier indispensables.

Les microservices ne font pas partie du chantier actif.

## 2. Réorganisation du dépôt

### Réalisé
- Création d'un second répertoire de travail Git avec `git worktree`.
- Création de la branche `v1-stabilisation` depuis `v1-preparation`.
- Déplacement du backend dans `backend/`.
- Renommage de `pos-platform-ui/` en `frontend/`.
- Déplacement de la documentation Java vers `docs/`.
- Suppression des cinq anciennes captures à la racine.
- Retrait de leurs références dans le README.

### Vérifications effectuées
- `.\mvnw.cmd clean test` : BUILD SUCCESS.
- `npm run build` : compilation Vite réussie.
- Aucun `node_modules`, `target` ou `dist` détecté dans les fichiers préparés pour le commit.

### Restant à confirmer
- Commit de réorganisation effectivement créé.
- Branche poussée sur GitHub.
- Démarrage conjoint backend/frontend.
- Parcours utilisateur de bout en bout.
- Éventuels chemins obsolètes dans le README et les configurations.

## 3. Fonctionnalités existantes à auditer

### Gestion des utilisateurs
- Contrôleurs d'authentification.
- Connexion par code PIN.
- Gestion des utilisateurs et rôles.

### Catalogue
- Catégories.
- Produits.
- Prix actifs et historique des prix.
- Gestion du stock.

### Ventes
- Panier.
- Enregistrement des ventes.
- Lignes de vente.
- Historique et consultation des ventes.

### Tableau de bord
- Indicateurs de ventes.
- Chiffre d'affaires.
- Produits populaires.
- Alertes de stock.

L'existence de ces composants ne garantit pas encore leur niveau de fiabilité en production.

## 4. Chantier prioritaire : authentification et sécurité

**Statut : à auditer.**

### Points à examiner
1. Stockage et vérification des codes PIN.
2. Identification de l'utilisateur connecté.
3. Gestion des sessions et de leur expiration.
4. Protection des endpoints REST.
5. Autorisations selon les rôles.
6. Création du premier compte et des comptes suivants.
7. Déconnexion et récupération d'accès.
8. Limitation des tentatives de connexion.
9. Gestion des erreurs et protection des données sensibles.
10. Tests automatisés des mécanismes de sécurité.

### Critère de réussite

Un utilisateur ne doit pouvoir accéder qu'aux données et opérations explicitement autorisées pour son rôle, y compris lorsqu'il appelle directement l'API sans passer par l'interface React.

## 5. Chantiers suivants

| Priorité | Chantier | Statut |
|---|---|---|
| P0 | Authentification et sécurité | À auditer |
| P0 | Intégrité des ventes et stocks | À auditer |
| P1 | Gestion des erreurs et validation | À auditer |
| P1 | Tests automatisés | À renforcer |
| P1 | Expérience utilisateur React | À évaluer |
| P1 | Déploiement et sauvegardes | À définir |
| P2 | Préparation du pilote commercial | À planifier |
| P2 | Modèle économique | À approfondir |

Ces priorités pourront évoluer après l'audit.

## 6. Prochaine action

Examiner le parcours d'authentification actuel de bout en bout :

**Saisie du PIN → requête React → contrôleur Spring Boot → vérification de l'identité → session → accès aux endpoints protégés.**

Pour chaque étape, documenter :
- Le comportement actuel vérifié.
- Les risques.
- La correction proposée.
- Les tests nécessaires.
- La décision retenue.

## 7. Règles de continuité

À la fin de chaque séance :
- Mettre à jour l'état d'avancement si nécessaire.
- Consigner les décisions durables.
- Identifier la prochaine action concrète.
- Vérifier les changements Git.
- Créer un commit lorsque le travail forme une unité cohérente.

Ne jamais inscrire une fonctionnalité comme « validée » sans preuve suffisante.