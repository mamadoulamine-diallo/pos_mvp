# 13. Sécurité de l'application

## 13.1 Prise en compte de la sécurité

La sécurité a été prise en compte progressivement au cours du développement de PROJECT_POS.

Le projet manipule plusieurs catégories de données qui nécessitent une attention particulière :

- les comptes utilisateurs ;
- les codes PIN utilisés pour l'authentification ;
- les informations liées aux ventes ;
- les données commerciales ;
- les informations de stock et de prix ;
- les identifiants permettant l'accès aux bases de données ;
- les configurations des différents services.

L'évolution du projet d'un monolithe vers une architecture distribuée a également augmenté la surface technique à sécuriser.

La V2 nécessite notamment de prendre en compte :

- l'accès aux API ;
- la gestion de la session utilisateur ;
- les communications entre services ;
- les secrets de configuration ;
- l'exposition des bases de données ;
- la configuration de l'infrastructure.

La démarche retenue consiste à sécuriser les besoins réellement présents dans le projet tout en identifiant explicitement les améliorations nécessaires pour une future mise en production.

---

## 13.2 Authentification par code PIN

PROJECT_POS est conçu pour une utilisation simple dans un contexte de point de vente.

L'authentification repose actuellement sur un code PIN associé à chaque utilisateur.

Les utilisateurs possèdent également un rôle métier :

- `VENDEUR` ;
- `GERANT`.

Le `user-service` est responsable de la gestion des utilisateurs et de leur authentification.

Les principales opérations d'authentification sont exposées sous :

```text
/api/v1/auth
```

avec notamment :

```text
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

Lors d'une authentification, le PIN fourni est recherché parmi les utilisateurs actifs.

Un PIN incorrect entraîne le refus de l'authentification.

Les tests fonctionnels ont notamment vérifié :

- une authentification valide ;
- la récupération de l'utilisateur courant ;
- le refus d'un PIN invalide ;
- le refus d'une opération nécessitant une session lorsque celle-ci est absente.

---

## 13.3 Gestion de la session

L'authentification de la version actuelle repose sur `HttpSession`.

Après une authentification réussie, l'utilisateur courant est conservé dans la session côté serveur.

Les requêtes suivantes utilisent le cookie de session pour identifier l'utilisateur connecté.

Dans l'architecture distribuée, ce mécanisme nécessite de transmettre les informations de session nécessaires lors de certaines communications.

Par exemple, lors de la création d'une vente, `sale-service` peut interroger `user-service` afin de récupérer l'utilisateur courant.

Le cookie reçu par la requête est alors transmis lors de l'appel nécessaire à l'authentification.

Cette solution a été conservée volontairement pour le périmètre du projet.

Elle permet de maintenir le mécanisme d'authentification déjà validé sans introduire simultanément une nouvelle architecture de sécurité pendant la migration vers les microservices.

---

## 13.4 Limites de l'authentification actuelle

La gestion de session actuelle est adaptée à l'environnement de démonstration et au périmètre pédagogique du projet, mais elle présente des limites dans une architecture distribuée.

À mesure que le nombre de services augmente, la propagation d'une session serveur devient plus difficile à gérer.

Une évolution possible serait l'utilisation d'une authentification basée sur des jetons, par exemple avec JWT ou un serveur d'identité utilisant OAuth2 / OpenID Connect.

Une telle architecture pourrait permettre :

- une authentification plus adaptée à un système distribué ;
- une validation plus homogène de l'identité entre les services ;
- une meilleure séparation entre authentification et logique métier ;
- une gestion plus fine des autorisations.

Cette évolution n'a volontairement pas été implémentée dans la V2.

L'objectif était de stabiliser l'architecture distribuée existante avant d'introduire une nouvelle couche de complexité liée à la sécurité.

---

## 13.5 Contrôle des données entrantes

Les API utilisent des DTO afin de limiter les données reçues et exposées par les contrôleurs.

Lorsque cela est nécessaire, les requêtes utilisent les mécanismes de validation fournis par Jakarta Validation.

Par exemple, une demande de création de vente impose la présence d'une liste d'articles valide.

Une ligne de vente nécessite notamment :

- un identifiant produit ;
- une quantité au minimum égale à 1.

Les validations permettent de rejeter certaines données incorrectes avant leur traitement par la logique métier.

Les services effectuent également leurs propres contrôles.

Par exemple :

- un stock insuffisant empêche son décrément ;
- un produit doit disposer des informations de prix nécessaires pour être vendu ;
- un PIN doit respecter les contraintes d'unicité prévues par le domaine ;
- certaines opérations vérifient l'existence des ressources demandées.

La validation des entrées ne repose donc pas uniquement sur l'interface utilisateur.

---

## 13.6 Gestion des erreurs

Une API ne doit pas exposer inutilement les détails internes de son fonctionnement au client.

Des gestionnaires d'exceptions permettent de convertir certaines erreurs applicatives en réponses HTTP adaptées.

Par exemple, une donnée métier invalide peut produire une réponse HTTP `400 Bad Request`.

Une tentative de création de vente sans session valide a également été testée et retourne une réponse `401 Unauthorized`.

L'objectif est de fournir au client une information exploitable sans lui transmettre directement une trace d'exception interne.

Les traces techniques restent destinées aux journaux de l'application et au diagnostic du développeur.

---

## 13.7 Séparation des bases de données

La V2 utilise une base de données indépendante pour chaque domaine SQL :

```text
user-service    → pos_user_db
product-service → pos_product_db
sale-service    → pos_sale_db
```

`activity-service` utilise séparément MongoDB :

```text
activity-service → pos_activity_db
```

Cette organisation limite le couplage entre les services.

Un service n'accède pas directement aux tables appartenant à un autre domaine.

Par exemple, `sale-service` ne modifie pas directement le stock dans la base de `product-service`.

Il doit utiliser l'API du service propriétaire de cette donnée.

Cette séparation permet de mieux contrôler les responsabilités et les chemins d'accès aux données.

---

## 13.8 Gestion des secrets

La gestion des secrets a constitué un point d'amélioration concret pendant le développement de la V2.

Dans une première version de l'infrastructure Docker Compose, un mot de passe MySQL était directement présent dans le fichier de configuration.

Cette pratique présentait un risque, car un secret contenu dans un fichier versionné peut être enregistré dans l'historique Git et transmis au dépôt distant.

La configuration a donc été corrigée.

Le fichier :

```text
microservices/.env
```

contient les valeurs locales nécessaires à Docker Compose et n'est pas versionné.

Le fichier :

```text
microservices/.gitignore
```

exclut ce fichier de l'historique Git.

Docker Compose utilise désormais une variable d'environnement :

```text
MYSQL_ROOT_PASSWORD
```

au lieu de contenir directement sa valeur.

---

## 13.9 Externalisation des secrets de configuration

La même problématique a été identifiée dans le dépôt utilisé par Spring Cloud Config.

Les configurations de :

```text
user-service
product-service
sale-service
```

contenaient initialement une valeur de connexion à la base directement dans les fichiers de configuration.

Les configurations ont été modifiées afin d'utiliser :

```text
${MYSQL_ROOT_PASSWORD}
```

La valeur réelle est fournie par l'environnement d'exécution et n'est donc plus enregistrée dans les fichiers suivis par Git.

Pour le développement local, les services exécutés depuis IntelliJ IDEA reçoivent la variable d'environnement depuis leur configuration d'exécution.

Cette organisation permet de séparer :

```text
configuration applicative
        ≠
secret d'environnement
```

---

## 13.10 Rotation des identifiants compromis

La suppression d'un secret dans la dernière version d'un fichier Git ne suffit pas à garantir qu'il n'est plus accessible.

Une valeur précédemment commitée peut rester présente dans l'historique du dépôt.

Lors de la correction de la configuration de PROJECT_POS, les identifiants MySQL concernés ont donc été modifiés.

La nouvelle valeur a ensuite été synchronisée uniquement dans les environnements locaux nécessaires à l'exécution.

Cette expérience a permis de mettre en évidence une règle importante :

> Un secret exposé dans un dépôt doit être considéré comme compromis et doit être révoqué ou remplacé.

La réécriture complète de l'historique Git n'a pas été retenue dans le périmètre actuel.

La priorité a été donnée à la rotation du secret et à la suppression de son utilisation dans les fichiers versionnés.

---

## 13.11 Configuration centralisée et sécurité

Spring Cloud Config permet de centraliser les configurations des microservices.

Cette centralisation facilite la maintenance, mais elle implique également de distinguer les paramètres pouvant être versionnés des informations sensibles.

Le dépôt de configuration peut contenir des éléments tels que :

- ports ;
- noms des services ;
- paramètres Spring ;
- configuration de découverte de services ;
- configuration fonctionnelle non sensible.

Les secrets doivent être fournis séparément par l'environnement d'exécution.

Cette séparation réduit le risque de publier involontairement des informations sensibles avec le code source ou la configuration distante.

---

## 13.12 Journalisation des activités

`activity-service` apporte une première fonction de traçabilité applicative.

Un événement peut contenir :

```text
eventType
occurredAt
userId
sourceService
entityType
entityId
metadata
```

Par exemple, une modification de prix peut produire un événement :

```text
PRICE_CHANGED
```

contenant les informations permettant d'identifier le produit concerné et les anciennes et nouvelles valeurs utiles à la traçabilité.

Les événements sont considérés comme immuables.

L'API permet donc leur création et leur consultation, mais ne fournit pas d'opération métier destinée à les modifier ou les supprimer.

Cette approche limite l'altération a posteriori du journal fonctionnel.

---

## 13.13 Sécurité de l'infrastructure locale

Les bases de données et les composants d'infrastructure sont exécutés dans des conteneurs Docker.

Les services de données utilisent des volumes nommés afin de conserver les données lorsque les conteneurs sont recréés.

Des contrôles de santé ont également été ajoutés à :

- MySQL ;
- MongoDB ;
- Consul ;
- Config Server.

Ces contrôles ne constituent pas à eux seuls un mécanisme de sécurité.

Ils permettent cependant de détecter l'indisponibilité d'un composant et contribuent à une infrastructure plus maîtrisée.

L'environnement actuel reste un environnement local de développement et de démonstration.

Les ports techniques exposés localement ne représenteraient pas une configuration de production suffisante.

---

## 13.14 Sécurisation nécessaire pour une mise en production

Une mise en production réelle nécessiterait des mesures supplémentaires.

Parmi les évolutions à étudier figurent notamment :

- utilisation de HTTPS/TLS ;
- terminaison TLS au niveau d'un reverse proxy ou de l'infrastructure ;
- politique CORS limitée aux origines autorisées ;
- gestion renforcée des secrets ;
- comptes de bases de données avec privilèges minimaux ;
- suppression de l'utilisation du compte administrateur MySQL par les applications ;
- protection des composants d'administration ;
- limitation des ports exposés publiquement ;
- authentification adaptée à l'architecture distribuée ;
- contrôle plus fin des autorisations selon les rôles ;
- centralisation et surveillance des journaux ;
- sauvegarde et restauration des données ;
- mise à jour régulière des dépendances ;
- analyse des vulnérabilités des composants et des images.

Ces mesures sont identifiées comme des exigences d'une exploitation réelle et non comme des fonctionnalités déjà présentes dans la V2.

---

## 13.15 RGPD et données personnelles

PROJECT_POS manipule des informations relatives aux utilisateurs de l'application, notamment leur identité professionnelle et leurs informations d'authentification.

Le principe retenu consiste à limiter les données collectées à celles nécessaires au fonctionnement du produit.

Une exploitation réelle nécessiterait également de formaliser davantage :

- les finalités du traitement ;
- la durée de conservation ;
- les droits des personnes concernées ;
- les procédures de suppression ou d'anonymisation ;
- la politique de sauvegarde ;
- les responsabilités du responsable de traitement et des éventuels sous-traitants.

Ces éléments dépassent le périmètre technique actuel du prototype mais doivent être pris en compte avant une exploitation commerciale réelle.

---

## 13.16 Bilan de la sécurité

La sécurité de PROJECT_POS a évolué avec l'architecture du projet.

Les principaux mécanismes actuellement mis en œuvre concernent :

- l'authentification des utilisateurs ;
- la gestion de session ;
- la validation des données reçues ;
- le contrôle de certaines règles métier côté serveur ;
- la gestion structurée des erreurs ;
- la séparation des données entre services ;
- l'externalisation des secrets ;
- la rotation d'un secret précédemment exposé ;
- la traçabilité de certains événements métier.

Le développement a également permis d'identifier plusieurs limites importantes de l'environnement actuel.

La gestion de session distribuée, l'utilisation de comptes MySQL fortement privilégiés, l'absence de TLS et l'absence d'une gestion centralisée avancée des identités montrent que la V2 reste une architecture de développement et de démonstration.

Ces limites sont documentées plutôt que masquées.

Elles permettent de distinguer les mécanismes réellement implémentés des exigences supplémentaires nécessaires pour transformer PROJECT_POS en système exploitable en production.