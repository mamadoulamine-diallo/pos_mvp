# 16. Perspectives et conclusion

## 16.1 Bilan du projet

PROJECT_POS est né d'un besoin concret observé dans plusieurs commerces : disposer d'un outil simple permettant de suivre les produits, le stock et les ventes sans dépendre de cahiers, de messages ou de calculs manuels.

Le projet a progressivement dépassé la réalisation d'une simple interface de caisse.

Le besoin métier met également en évidence des problématiques de traçabilité, de supervision et de cohérence des informations commerciales, particulièrement lorsque plusieurs boutiques ou plusieurs utilisateurs interviennent.

Le développement a été organisé de manière progressive :

```text
Besoin métier
    ↓
MVP monolithique
    ↓
API REST
    ↓
Frontend React
    ↓
Architecture microservices
    ↓
Tests et industrialisation
```

Cette progression a permis de conserver un produit fonctionnel tout en faisant évoluer son architecture.

---

## 16.2 Le MVP comme première validation

La première version avait pour objectif de valider rapidement les principales règles métier.

Elle reposait sur :

```text
Spring Boot
Spring MVC
Thymeleaf
JPA / Hibernate
MySQL
JavaScript
HTML / CSS
```

Cette version permettait notamment de gérer :

- les utilisateurs ;
- les catégories ;
- les produits ;
- le stock ;
- les prix ;
- les ventes ;
- l'historique commercial ;
- les principaux indicateurs du tableau de bord.

Le MVP a surtout permis de vérifier la cohérence du modèle métier avant d'engager des transformations architecturales plus importantes.

---

## 16.3 La V1 comme étape de découplage

La V1 a introduit une séparation entre l'interface utilisateur et le backend.

Les fonctionnalités métier ont progressivement été exposées sous forme d'API REST et une nouvelle interface a été développée avec React.

La trajectoire est alors devenue :

```text
React
   ↓
API REST Spring Boot
   ↓
MySQL
```

Cette évolution a permis de réduire le couplage entre la présentation et le backend tout en conservant les règles métier validées pendant le MVP.

Elle a également préparé le passage vers une architecture distribuée.

---

## 16.4 La V2 comme évolution architecturale

La V2 répartit le backend entre plusieurs services :

```text
user-service
product-service
sale-service
activity-service
api-gateway
config-server
```

L'infrastructure s'appuie également sur :

```text
Consul
MySQL
MongoDB
Docker Compose
GitHub Actions
```

Cette version permet d'expérimenter concrètement les problématiques liées :

- aux architectures distribuées ;
- à la découverte de services ;
- à la configuration centralisée ;
- aux communications inter-services ;
- à la séparation des données ;
- à l'utilisation de SQL et NoSQL ;
- à la conteneurisation ;
- aux tests ;
- à l'intégration continue.

La V2 représente l'aboutissement technique du projet dans le cadre actuel du dossier.

Elle ne constitue cependant pas la fin de l'évolution du produit.

---

## 16.5 Une architecture volontairement progressive

Le développement de PROJECT_POS a confirmé l'intérêt d'une démarche progressive.

Une architecture microservices dès le début aurait introduit de nombreuses problématiques techniques avant même que les règles métier soient suffisamment stabilisées.

Le MVP monolithique a permis de travailler en priorité sur :

```text
le besoin
les données
les règles métier
l'expérience utilisateur
```

La séparation REST/React a ensuite réduit le couplage de la couche de présentation.

Enfin, les microservices ont été introduits lorsque les principaux domaines fonctionnels étaient suffisamment identifiables.

La trajectoire :

```text
Monolithe
   ↓
Frontend / Backend séparés
   ↓
Microservices
```

a ainsi permis d'augmenter progressivement la complexité technique.

---

## 16.6 Limites actuelles

Malgré les évolutions réalisées, plusieurs limites restent connues.

### Transactions distribuées

Une vente peut nécessiter une modification du stock dans `product-service` puis un enregistrement dans `sale-service`.

Ces opérations ne partagent pas une transaction SQL unique.

Une défaillance entre les deux opérations peut donc produire une incohérence.

### Journal d'activité

L'indisponibilité de `activity-service` ne bloque pas l'opération métier principale.

En revanche, la V2 ne dispose pas encore d'un mécanisme garantissant la reprise automatique d'un événement non transmis.

### Authentification

L'authentification utilise encore une session HTTP.

Cette solution fonctionne dans le périmètre actuel mais pourrait devenir moins adaptée à mesure que l'architecture distribuée évolue.

### Déploiement

L'intégration continue est automatisée, mais le projet ne dispose pas encore d'une chaîne complète de déploiement continu vers un environnement de production.

### Infrastructure

L'environnement actuel est principalement conçu pour le développement et la démonstration.

Une exploitation commerciale nécessiterait une infrastructure renforcée, notamment en matière de sécurité, de supervision, de sauvegarde et de disponibilité.

Ces limites sont identifiées afin de distinguer clairement l'état actuel du projet de ses évolutions possibles.

---

## 16.7 Évolution de la gestion des transactions

Une évolution importante concernerait la fiabilité des opérations distribuées.

Plusieurs solutions pourraient être étudiées :

```text
Saga Pattern
opérations compensatoires
Outbox Pattern
messagerie asynchrone
```

Par exemple, une architecture événementielle pourrait permettre de découpler certaines opérations :

```text
Vente validée
     ↓
événement
     ↓
mise à jour des composants concernés
```

Une telle évolution nécessiterait cependant de traiter de nouvelles problématiques :

- ordre des événements ;
- duplication ;
- idempotence ;
- reprise après erreur ;
- supervision ;
- cohérence éventuelle.

Elle ne doit donc être introduite que si le besoin du produit le justifie.

---

## 16.8 Évolution de la sécurité

Une version destinée à une exploitation réelle nécessiterait également une évolution de la sécurité.

Plusieurs axes ont été identifiés :

- HTTPS/TLS ;
- contrôle plus fin des autorisations ;
- politique CORS adaptée ;
- gestion centralisée des secrets ;
- comptes de base de données à privilèges limités ;
- protection des composants d'administration ;
- centralisation des journaux ;
- surveillance des dépendances ;
- stratégie de sauvegarde et de restauration.

L'authentification pourrait également évoluer vers une solution mieux adaptée à une architecture distribuée, par exemple à base de jetons ou d'un fournisseur d'identité.

Cette évolution devra conserver la simplicité d'utilisation recherchée pour le personnel en boutique.

---

## 16.9 Évolution du déploiement

La chaîne GitHub Actions actuelle valide automatiquement les six applications Maven.

Une évolution naturelle serait de prolonger cette intégration continue vers une chaîne de livraison :

```text
Push Git
   ↓
Tests
   ↓
Build
   ↓
Images Docker
   ↓
Registry
   ↓
Environnement de recette
   ↓
Tests système
   ↓
Validation
   ↓
Production
```

Les microservices applicatifs pourraient alors disposer chacun de leur propre image.

Cette évolution faciliterait la reproductibilité entre les environnements.

Elle permettrait également de préparer un hébergement distant lorsque le produit atteindra un niveau de maturité suffisant.

---

## 16.10 Supervision et observabilité

Une architecture composée de plusieurs services nécessite davantage de visibilité qu'un monolithe.

Une évolution future pourrait introduire des mécanismes permettant de suivre :

- l'état des services ;
- les erreurs ;
- les temps de réponse ;
- les ressources utilisées ;
- les appels entre services ;
- les événements métier importants.

Des métriques et des tableaux de bord permettraient d'identifier plus rapidement un dysfonctionnement.

Une centralisation des logs faciliterait également l'analyse d'une opération traversant plusieurs microservices.

L'observabilité deviendrait particulièrement importante dans le cas d'un déploiement multi-boutiques.

---

## 16.11 Évolution fonctionnelle : supervision multi-boutiques

La perspective fonctionnelle principale dépasse le fonctionnement d'une caisse isolée.

Le besoin métier observé conduit vers une plateforme capable de superviser plusieurs commerces ou plusieurs points de vente.

Une telle évolution pourrait permettre de disposer d'une vision consolidée :

```text
Entreprise
   │
   ├── Boutique A
   │     ├── ventes
   │     ├── stock
   │     └── utilisateurs
   │
   ├── Boutique B
   │     ├── ventes
   │     ├── stock
   │     └── utilisateurs
   │
   └── Boutique C
         ├── ventes
         ├── stock
         └── utilisateurs
```

Le responsable pourrait alors consulter les informations de chaque établissement ainsi qu'une vue globale de l'activité.

Cette évolution nécessiterait notamment d'introduire explicitement les notions d'entreprise et de point de vente dans le modèle métier.

---

## 16.12 Traçabilité des flux commerciaux

L'une des problématiques identifiées sur le terrain concerne la capacité à comprendre les flux générés par chaque boutique.

Lorsque les marchandises sont fournies à crédit ou que plusieurs établissements participent à l'activité, connaître uniquement le chiffre d'affaires ne suffit pas.

Une évolution du produit pourrait permettre de rapprocher plusieurs informations :

```text
marchandise reçue
      ↓
stock disponible
      ↓
marchandise vendue
      ↓
chiffre d'affaires
      ↓
encaissements
      ↓
versements
      ↓
solde attendu
```

Cette vision permettrait d'améliorer la traçabilité et de détecter plus facilement les écarts entre les ventes enregistrées et les mouvements financiers.

Cette problématique constitue une perspective métier importante du produit.

Elle n'est toutefois pas intégrée artificiellement à la V2 actuelle : elle nécessitera la conception d'un véritable domaine fonctionnel consacré aux flux financiers.

---

## 16.13 Vers un domaine financier dédié

À terme, les fonctionnalités liées aux flux financiers pourraient former un nouveau domaine métier.

Il pourrait couvrir, selon les besoins validés avec les utilisateurs :

- les encaissements ;
- les versements ;
- les dépenses ;
- les créances ;
- les montants dus aux fournisseurs ;
- les écarts de caisse ;
- les rapprochements entre ventes et flux d'argent.

Ce domaine ne doit pas être ajouté uniquement comme une extension technique.

Il devra être conçu à partir des processus réellement utilisés dans les boutiques.

Une phase d'analyse fonctionnelle sera donc nécessaire avant de définir son modèle de données et son architecture.

Cette évolution a volontairement été reportée après le périmètre actuel afin de ne pas déstabiliser la version présentée pour le titre professionnel.

---

## 16.14 Évolution vers une offre SaaS

La séparation progressive des domaines ouvre également la possibilité de faire évoluer PROJECT_POS vers une offre de type SaaS.

Deux niveaux de produit pourraient notamment être étudiés.

Une offre simple pourrait répondre au besoin d'un commerce indépendant :

```text
1 commerce
gestion produits
gestion stock
ventes
utilisateurs
tableau de bord
```

Une offre plus avancée pourrait cibler les structures disposant de plusieurs boutiques :

```text
plusieurs points de vente
supervision centralisée
consolidation des données
traçabilité avancée
gestion des flux
reporting
```

Cette distinction correspondrait à des besoins métier différents plutôt qu'à une simple limitation artificielle des fonctionnalités.

Avant toute commercialisation, cette hypothèse devrait être confrontée à de nouveaux utilisateurs et à des conditions réelles d'exploitation.

---

## 16.15 Retour sur les choix techniques

Le projet a également permis de comprendre qu'une technologie ne constitue pas une finalité.

Plusieurs choix ont été réalisés en fonction de l'état du projet.

Le monolithe était adapté à la validation initiale.

React a répondu au besoin de découplage de l'interface.

Les microservices ont permis d'étudier la séparation des domaines et les architectures distribuées.

MySQL reste adapté aux données transactionnelles fortement structurées.

MongoDB répond au besoin documentaire du journal d'activité.

Docker améliore la reproductibilité de l'infrastructure.

GitHub Actions automatise la validation des applications.

Chaque technologie répond donc à une problématique identifiée.

Cette démarche est plus importante que l'accumulation de technologies dans le projet.

---

## 16.16 Apports professionnels

PROJECT_POS a constitué un projet transversal couvrant plusieurs dimensions du métier de concepteur développeur d'applications.

Sa réalisation a nécessité :

- l'analyse d'un besoin réel ;
- la modélisation des données ;
- la conception d'interfaces ;
- le développement d'une application web ;
- la création d'API REST ;
- l'utilisation de bases SQL et NoSQL ;
- la conception d'une architecture distribuée ;
- l'intégration de services ;
- la gestion des erreurs ;
- la prise en compte de la sécurité ;
- la conception et l'exécution de tests ;
- la conteneurisation d'une infrastructure ;
- l'utilisation de Git ;
- la mise en place d'une intégration continue ;
- l'analyse et la résolution d'incidents techniques.

Le projet a également nécessité de prendre des décisions de périmètre.

Certaines solutions techniquement possibles n'ont volontairement pas été implémentées lorsqu'elles n'étaient pas nécessaires à la version actuelle.

Cette capacité à arbitrer entre besoin, complexité, délai et maintenabilité fait partie des principaux enseignements du projet.

---

## 16.17 Conclusion générale

PROJECT_POS a commencé comme une application destinée à simplifier la gestion quotidienne d'un commerce.

Le projet a progressivement évolué vers une plateforme de gestion commerciale dont l'objectif est de centraliser des informations auparavant dispersées entre plusieurs supports.

La première étape a consisté à construire un MVP fonctionnel permettant de valider les règles métier.

La deuxième a séparé le frontend et le backend à travers React et une API REST.

La troisième a réparti le backend dans une architecture microservices et introduit de nouvelles problématiques liées aux systèmes distribués, aux données SQL et NoSQL, à la configuration, aux tests et à l'intégration continue.

Cette évolution peut être résumée ainsi :

```text
PROBLÈME TERRAIN
      ↓
MVP FONCTIONNEL
      ↓
API REST + REACT
      ↓
MICROSERVICES
      ↓
SQL + NoSQL
      ↓
DOCKER + TESTS + CI
      ↓
PLATEFORME ÉVOLUTIVE
```

Le projet présenté n'est donc pas considéré comme un produit définitivement terminé.

Il constitue un socle fonctionnel et technique sur lequel pourront être développées les futures fonctionnalités de supervision multi-boutiques et de traçabilité des flux commerciaux.

La priorité reste cependant la même que lors de la création du MVP : faire évoluer l'architecture uniquement lorsqu'elle apporte une réponse à un besoin réel du produit.