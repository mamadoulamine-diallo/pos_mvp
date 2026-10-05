# Intégration continue — Architecture V2

## 1. Objectif

La V2 de PROJECT_POS repose sur une architecture distribuée composée de plusieurs services Spring Boot.

Afin de sécuriser les évolutions du projet, une chaîne d'intégration continue a été mise en place avec GitHub Actions.

L'objectif est de vérifier automatiquement que chaque service peut être compilé et que ses tests passent dans un environnement indépendant de la machine de développement.

## 2. Services concernés

Le pipeline CI couvre les six applications Maven de l'architecture V2 :

- `user-service`
- `product-service`
- `sale-service`
- `activity-service`
- `api-gateway`
- `config-server`

Les services sont exécutés indépendamment grâce à une matrice GitHub Actions.

## 3. Déclenchement du pipeline

Le workflow est défini dans :

`.github/workflows/backend-ci.yml`

Il est déclenché :

- lors d'un `push` sur la branche `v2-microservices` ;
- lors d'une `pull_request` ciblant cette même branche.

Cette automatisation permet de détecter une régression avant de poursuivre l'intégration du projet.

## 4. Environnement d'exécution

Chaque job utilise un environnement Linux reproductible :

- Ubuntu 24.04 ;
- Java 21 ;
- distribution Temurin ;
- Maven Wrapper fourni par chaque service ;
- cache Maven activé.

La commande exécutée pour chaque service est :

```bash
chmod +x mvnw
./mvnw clean verify
```

L'utilisation du Maven Wrapper garantit que le pipeline ne dépend pas d'une installation Maven spécifique sur le runner.

## 5. Isolation de l'environnement de test

Les premiers essais du pipeline ont mis en évidence des dépendances implicites à l'environnement local de développement.

Les services SQL `user-service`, `product-service` et `sale-service` utilisent désormais une base H2 en mémoire pour leurs tests nécessitant un contexte Spring.

Des profils `test` permettent également de désactiver les dépendances externes qui ne sont pas nécessaires à l'exécution des tests, notamment Spring Cloud Config et Consul.

Le même principe a été appliqué à `api-gateway` et `activity-service`.

Pour `config-server`, les tests utilisent un backend `native`, ce qui permet de démarrer le contexte sans dépendre du dépôt Git distant de configuration.

Cette organisation rend les tests reproductibles sur un runner CI vierge.

## 6. Incidents rencontrés

La mise en place du pipeline a permis d'identifier plusieurs problèmes qui n'apparaissaient pas systématiquement sur l'environnement Windows local.

### 6.1 Maven Wrapper sous Linux

Les premiers jobs GitHub Actions ont échoué avec un code de sortie `126`, car le fichier `mvnw` n'était pas exécutable sur le runner Linux.

La commande suivante a donc été ajoutée au workflow :

```bash
chmod +x mvnw
```

Cette correction permet l'exécution du Maven Wrapper sur le runner Linux.

### 6.2 Dépendances SQL

Les tests de contexte des services SQL dépendaient initialement de la configuration MySQL utilisée en développement.

Sur le runner GitHub Actions, cette dépendance empêchait le chargement correct du contexte Spring.

Une configuration H2 spécifique aux tests a donc été mise en place pour :

- `user-service`
- `product-service`
- `sale-service`

Cette configuration permet aux tests concernés de fonctionner sans dépendre des instances MySQL utilisées en développement.

### 6.3 Spring Cloud Config

Certains services échouaient sur le runner avec l'erreur :

`No spring.config.import set`

Les configurations de test ont été isolées afin de désactiver Spring Cloud Config et Consul lorsqu'ils ne sont pas nécessaires à l'exécution du test.

Cette correction a notamment été appliquée à :

- `api-gateway`
- `activity-service`

Pour `config-server`, le problème était différent : son contexte nécessitait normalement la configuration d'un dépôt Git distant.

Un profil de test utilisant le backend `native` a donc été mis en place afin que le Config Server puisse démarrer de manière autonome pendant les tests.

## 7. Résultat final

Après correction des différents problèmes de portabilité et d'isolation, le pipeline a été exécuté avec succès sur GitHub Actions.

Les six jobs de la matrice sont validés :

- `activity-service` : succès ;
- `api-gateway` : succès ;
- `config-server` : succès ;
- `product-service` : succès ;
- `sale-service` : succès ;
- `user-service` : succès.

Le pipeline final utilise :

- Ubuntu 24.04 ;
- Java 21 avec Temurin ;
- `actions/checkout@v7` ;
- `actions/setup-java@v6` ;
- Maven Wrapper ;
- le cache Maven ;
- une matrice de six services.

Le résultat final obtenu sur GitHub Actions est donc :

**6 services construits et testés avec succès sur 6.**

## 8. Apport de la CI au projet

La mise en place de cette intégration continue ne se limite pas à l'exécution automatique des tests.

Elle a permis de mettre en évidence plusieurs dépendances implicites à l'environnement de développement local et d'améliorer la reproductibilité du projet.

Un développeur peut désormais pousser une modification sur la branche V2 et obtenir automatiquement une validation indépendante de sa machine locale.

Le pipeline constitue également un filet de sécurité contre les régressions lors des futures évolutions des microservices.

## 9. Limites et évolutions possibles

Le pipeline actuel réalise volontairement une intégration continue et non un déploiement automatique en production.

Dans le contexte actuel du projet, l'objectif prioritaire est de disposer d'un processus reproductible permettant de compiler et tester les différents services avant leur intégration.

Une évolution future pourrait compléter cette chaîne par :

- la construction automatique des images Docker des services applicatifs ;
- la publication des images dans un registre ;
- le déploiement automatique vers un environnement de recette ;
- l'exécution de tests d'intégration après déploiement ;
- la mise en place d'une stratégie de livraison continue.

Ces évolutions constituent une continuité possible de la démarche DevOps mais ne sont pas nécessaires au périmètre actuel de la V2.

## 10. Conclusion

La chaîne d'intégration continue de PROJECT_POS V2 permet désormais de valider automatiquement les six applications Maven de l'architecture microservices.

Sa mise en place a nécessité l'adaptation des tests à un environnement Linux indépendant, l'isolation des dépendances SQL et Spring Cloud ainsi que la résolution de plusieurs erreurs révélées par GitHub Actions.

Le pipeline final est reproductible et validé avec six jobs sur six en succès.

Cette mise en œuvre constitue la base DevOps de la V2 et pourra être étendue ultérieurement vers une chaîne de livraison ou de déploiement continu.