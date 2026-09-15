# 10. Analyse critique du MVP

## 10.1 Objectifs de l'analyse critique

La réalisation du MVP a permis de valider les principaux besoins métier identifiés lors de la phase d’analyse.

Toutefois, comme toute première version d’un produit, cette application présente certaines limites fonctionnelles et techniques.

L’objectif de cette analyse est d’identifier les points forts du MVP, les difficultés rencontrées ainsi que les axes d’amélioration permettant de préparer les futures évolutions du projet.

Cette démarche s’inscrit dans une logique d’amélioration continue et constitue une étape importante dans la conception d’une solution évolutive.

---

## 10.2 Points forts du MVP

La première force du projet réside dans sa proximité avec un besoin métier réel.

Le projet ne répond pas à un cas théorique mais à des problématiques observées dans le fonctionnement quotidien de nombreux commerces de proximité.

Le MVP permet aujourd’hui :

* la gestion des utilisateurs ;
* la gestion des produits ;
* la gestion des catégories ;
* le suivi du stock ;
* l’historisation des prix ;
* l’enregistrement des ventes ;
* le calcul des indicateurs commerciaux ;
* la centralisation des données.

L’application fournit ainsi une première réponse concrète aux difficultés de suivi et de visibilité observées sur le terrain.

---

## 10.3 Choix techniques pertinents

Plusieurs décisions techniques se sont révélées particulièrement adaptées au contexte du projet.

L’architecture MVC a permis de maintenir une séparation claire des responsabilités entre les différentes couches de l’application.

L’organisation modulaire par domaine métier a facilité la maintenance du code et limité le couplage entre les composants.

Le choix d’une base de données relationnelle a permis de garantir l’intégrité des données et la cohérence des transactions commerciales.

L’introduction d’une entité ProductPrice dédiée à l’historique des prix s’est révélée particulièrement pertinente pour assurer la traçabilité des évolutions tarifaires.

La conservation du prix unitaire dans chaque ligne de vente garantit également la fiabilité de l’historique des transactions.

---

## 10.4 Limites fonctionnelles

Le MVP a volontairement été limité afin de conserver un périmètre réaliste.

Certaines fonctionnalités ont donc été reportées à des versions ultérieures.

Parmi les principales limitations figurent :

* l’absence de gestion multi-boutiques ;
* l’absence de gestion avancée des fournisseurs ;
* l’absence d’inventaire détaillé ;
* l’absence d’exports comptables ;
* l’absence de système de notifications métier ;
* l’absence de gestion hors ligne ;
* l’absence d’application mobile dédiée.

Ces limitations sont cohérentes avec l’objectif initial du MVP qui consiste à valider les besoins essentiels avant d’élargir le périmètre fonctionnel.

---

## 10.5 Limites techniques

Certaines limites techniques apparaissent également lorsque l’on envisage une montée en charge du produit.

L’application repose actuellement sur une architecture monolithique.

Cette approche est adaptée au MVP mais présente certaines contraintes lorsque le nombre d’utilisateurs ou le volume de données augmente.

Les principales limites identifiées sont :

* déploiement unique de l’ensemble de l’application ;
* couplage entre le frontend et le backend ;
* difficulté à faire évoluer certaines parties indépendamment ;
* scalabilité limitée ;
* maintenance plus complexe à mesure que le projet grandit.

Ces limites ne constituent pas un problème dans le contexte actuel mais devront être prises en compte dans les futures évolutions.

---

## 10.6 Enseignements tirés du projet

La réalisation du MVP a permis de mettre en évidence plusieurs enseignements importants.

Le premier enseignement concerne l’importance de la compréhension métier avant le développement.

Plusieurs décisions de conception, notamment concernant l’historique des prix ou la gestion du stock, trouvent directement leur origine dans l’analyse des besoins réels des utilisateurs.

Le second enseignement concerne la valeur d’une approche progressive.

Le choix de construire d’abord un MVP stable a permis de limiter les risques techniques et de valider les hypothèses métier avant d’envisager une architecture plus complexe.

Enfin, le projet a confirmé l’intérêt d’une séparation claire entre les responsabilités fonctionnelles et techniques afin de faciliter les évolutions futures.

---

## 10.7 Préparation des évolutions futures

L’analyse du MVP montre que la base fonctionnelle est aujourd’hui suffisamment solide pour envisager une nouvelle étape dans l’évolution du produit.

La prochaine phase de développement vise à :

* séparer le frontend du backend ;
* exposer les fonctionnalités via une API REST ;
* moderniser l’interface utilisateur ;
* renforcer la sécurité ;
* améliorer les possibilités de déploiement.

Cette évolution constituera la première étape vers une architecture plus distribuée et plus adaptée à une utilisation à grande échelle.

---

## 10.8 Conclusion

Le MVP a permis de valider la faisabilité du projet et de démontrer la pertinence de la solution proposée.

Les choix techniques réalisés répondent efficacement aux besoins actuels tout en préparant les évolutions futures.

L’analyse critique met en évidence une trajectoire claire d’évolution du produit : partir d’un MVP monolithique stable, puis progresser vers une architecture moderne reposant sur une API REST, un frontend React et, à plus long terme, une architecture distribuée orientée microservices.

Cette approche progressive permet de conserver une cohérence technique tout en maîtrisant la complexité du projet.
