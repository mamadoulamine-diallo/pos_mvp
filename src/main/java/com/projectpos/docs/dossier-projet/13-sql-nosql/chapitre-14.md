# 14. Persistance des données : SQL et NoSQL

## 14.1 Objectifs

PROJECT_POS utilise deux approches de persistance dans son architecture V2 :

- MySQL pour les données métier structurées et transactionnelles ;
- MongoDB pour le journal d'activité.

Ce choix permet de mettre en œuvre deux modèles de stockage différents en fonction de la nature des données manipulées.

L'objectif n'est pas de remplacer systématiquement le modèle relationnel par une base NoSQL.

Au contraire, chaque technologie est utilisée pour répondre à un besoin différent.

Les données liées aux utilisateurs, aux produits, aux prix et aux ventes possèdent des relations et des contraintes fortes. Elles restent donc stockées dans des bases relationnelles.

Les événements d'activité présentent une structure plus flexible et sont principalement ajoutés puis consultés. Ils sont stockés sous forme de documents dans MongoDB.

---

## 14.2 Persistance relationnelle du MVP

Dans le MVP, l'ensemble des données métier était stocké dans une base MySQL unique.

Les principales entités étaient :

```text
AppUser
Category
Product
ProductPrice
Sale
SaleItem
```

Le modèle relationnel permettait notamment de représenter les relations suivantes :

```text
AppUser 1 ───── * Sale

Category 1 ──── * Product

Product 1 ───── * ProductPrice

Sale 1 ──────── * SaleItem

Product 1 ───── * SaleItem
```

Cette organisation était adaptée au monolithe car l'ensemble de l'application partageait le même modèle de données et la même transaction locale.

JPA et Hibernate assuraient la correspondance entre les entités Java et les tables MySQL.

---

## 14.3 Évolution du modèle dans la V2

Le passage aux microservices a nécessité de revoir la manière dont les données sont réparties.

Chaque service est désormais propriétaire de ses données.

L'organisation devient :

```text
user-service
    |
    +── MySQL
        pos_user_db

product-service
    |
    +── MySQL
        pos_product_db

sale-service
    |
    +── MySQL
        pos_sale_db

activity-service
    |
    +── MongoDB
        pos_activity_db
```

Cette séparation respecte le principe selon lequel un service ne doit pas dépendre directement du schéma interne de la base d'un autre service.

Les relations entre domaines ne sont donc plus représentées par des clés étrangères entre plusieurs bases.

Elles sont remplacées par des identifiants et par des appels entre services lorsque des informations complémentaires sont nécessaires.

---

## 14.4 Base de données du user-service

Le `user-service` possède les données liées aux utilisateurs.

L'entité principale est `AppUser`.

Elle contient notamment :

```text
id
fullName
email
pinCode
role
active
```

Le rôle est représenté par une énumération contenant :

```text
VENDEUR
GERANT
```

Le repository permet notamment de rechercher un utilisateur actif à partir de son PIN et de vérifier l'unicité de certaines données.

Les opérations d'accès aux données sont encapsulées dans le service.

Les autres microservices ne consultent pas directement cette base.

---

## 14.5 Base de données du product-service

Le `product-service` gère plusieurs entités relationnelles :

```text
Category
Product
ProductPrice
```

Une catégorie peut être associée à plusieurs produits.

Un produit possède notamment :

- son nom ;
- son stock ;
- son état actif ou inactif ;
- sa catégorie.

La gestion du prix est séparée dans `ProductPrice`.

Cette organisation permet de conserver un historique des changements de prix.

Un prix possède notamment :

```text
salePrice
purchasePrice
startDate
endDate
```

Un prix dont la date de fin est absente correspond au prix actif.

---

## 14.6 Historisation des prix

L'historisation des prix constitue une règle métier importante du projet.

Lorsqu'un prix est modifié, l'ancien prix actif ne doit pas être supprimé.

Il est clôturé en renseignant sa date de fin.

Un nouveau prix actif est ensuite créé.

Le processus peut être représenté ainsi :

```text
Prix actif actuel
endDate = NULL
       |
       | changement de prix
       v
Ancien prix
endDate = date de clôture
       |
       v
Nouveau prix
endDate = NULL
```

Cette organisation permet de conserver l'évolution des prix d'un produit.

Elle évite également de modifier rétroactivement les informations historiques.

Pendant le développement, cette règle a nécessité une attention particulière concernant l'unicité du prix actif.

La fermeture de l'ancien prix doit être persistée avant la création du nouveau.

Un `flush()` explicite a été conservé dans le service afin de garantir l'ordre nécessaire des opérations SQL avant l'insertion du nouveau prix actif.

Cette correction est issue d'un incident réel rencontré lors des tests du projet.

**Fichier source :** `microservices/product-service/src/main/java/com/projectpos/productservice/product/service/ProductPriceService.java`

Cette implémentation démontre la clôture du prix actif, l'utilisation explicite de `flush()` et la création d'un nouveau prix tout en préservant l'historique.
### Extrait d'implémentation : changement du prix actif

La règle d'historisation est implémentée dans `ProductPriceService`. Lors d'un changement de prix, le prix actuellement actif est d'abord clôturé avant la création du nouveau prix.

```java
currentPrice.setEndDate(LocalDateTime.now());

        repository.save(currentPrice);
repository.flush();

ProductPrice newPrice = new ProductPrice();

newPrice.setProduct(currentPrice.getProduct());
        newPrice.setSalePrice(salePrice);
newPrice.setPurchasePrice(purchasePrice);
newPrice.setStartDate(LocalDateTime.now());
        newPrice.setEndDate(null);

repository.save(newPrice);
```

L'appel explicite à `flush()` est volontaire. Il force Hibernate à synchroniser la clôture de l'ancien prix avec la base de données avant l'insertion du nouveau prix actif.

Cette correction a été introduite après la détection, pendant les tests, d'une violation de la contrainte d'unicité garantissant qu'un produit ne possède qu'un seul prix actif à un instant donné.

---

## 14.7 Gestion du stock

Le stock appartient au domaine produit.

Le `product-service` est donc responsable de sa modification.

Il expose notamment des opérations permettant :

```text
ajout de stock
retrait de stock
```

Lors d'un retrait, la logique métier vérifie que la quantité demandée peut être retirée.

Un stock insuffisant provoque une erreur au lieu de produire une quantité incohérente.

Dans la V2, `sale-service` ne modifie jamais directement la table contenant le produit.

Il appelle `product-service` pour demander le retrait du stock.

Le propriétaire de la donnée reste donc responsable de son intégrité métier.

---

## 14.8 Base de données du sale-service

Le `sale-service` stocke principalement :

```text
Sale
SaleItem
```

Une vente contient notamment :

- son identifiant ;
- sa date ;
- son statut ;
- l'identifiant de l'utilisateur ayant effectué la vente.

Une ligne de vente contient notamment :

- l'identifiant du produit ;
- la quantité ;
- le prix unitaire appliqué.

Dans le monolithe, certaines de ces relations pouvaient être représentées directement par des associations JPA entre entités.

Dans la V2, les bases sont séparées.

`sale-service` conserve donc des identifiants simples tels que :

```text
userId
productId
```

Il ne possède pas de clé étrangère vers les bases de `user-service` ou de `product-service`.

---

## 14.9 Conservation du prix de vente

Le prix enregistré dans `SaleItem` est volontairement conservé indépendamment du prix actuel du produit.

Lors de la création d'une vente :

```text
sale-service
      |
      v
product-service
      |
      v
prix actif du produit
      |
      v
SaleItem.unitPrice
```

Une modification ultérieure du prix du produit ne modifie donc pas les ventes déjà enregistrées.

Cette règle est essentielle pour conserver un historique commercial cohérent.

Par exemple, si un produit est vendu à un prix donné puis que son tarif change le lendemain, la vente précédente doit continuer à présenter le prix réellement appliqué au moment de la transaction.

---

## 14.10 Pourquoi conserver MySQL ?

Le modèle relationnel reste particulièrement adapté aux données métier principales de PROJECT_POS.

Ces données présentent :

- une structure stable ;
- des relations clairement identifiées ;
- des contraintes d'intégrité ;
- des opérations transactionnelles ;
- des besoins de recherche structurée.

Une vente et ses lignes constituent par exemple un ensemble fortement structuré.

De même, les produits et leurs historiques de prix possèdent des relations métier précises.

L'utilisation de MySQL pour ces domaines permet de conserver les garanties et les mécanismes relationnels déjà maîtrisés dans le MVP.

Le passage aux microservices n'a donc pas entraîné l'abandon du SQL.

Il a principalement entraîné la séparation des données selon leur domaine fonctionnel.

---

## 14.11 Introduction de MongoDB

La V2 introduit MongoDB pour le service :

```text
activity-service
```

Ce service a pour responsabilité de conserver des événements permettant de tracer certaines opérations du système.

Le document principal est `ActivityEvent`.

Il contient notamment :

```text
id
eventType
occurredAt
userId
sourceService
entityType
entityId
metadata
```

Le champ `metadata` permet de conserver des informations complémentaires sous la forme d'une structure clé-valeur.

Cette flexibilité constitue l'une des raisons du choix d'un modèle documentaire.

---

### Preuve de code : document MongoDB `ActivityEvent`

**Fichier source :** `microservices/activity-service/src/main/java/com/projectpos/activityservice/activity/entity/ActivityEvent.java`

Cette classe définit la structure documentaire des événements enregistrés dans la collection MongoDB `activity_events`.
Le modèle documentaire est déclaré avec Spring Data MongoDB :

```java
@Document(collection = "activity_events")
public class ActivityEvent {

    @Id
    private String id;

    private String eventType;
    private LocalDateTime occurredAt;
    private Integer userId;
    private String sourceService;
    private String entityType;
    private String entityId;
    private Map<String, Object> metadata;
}
```

Cet extrait de `ActivityEvent.java` (annotations Lombok omises pour la lisibilité) montre l'association à la collection `activity_events`. Le champ `metadata` accepte des attributs variables selon le type d'événement.

---

## 14.12 Exemple d'événement

Lorsqu'un prix est modifié dans `product-service`, un événement de type :

```text
PRICE_CHANGED
```

peut être transmis à `activity-service`.

Un document conceptuel peut contenir les informations suivantes :

```json
{
  "eventType": "PRICE_CHANGED",
  "occurredAt": "date de l'événement",
  "userId": null,
  "sourceService": "product-service",
  "entityType": "PRODUCT",
  "entityId": "12",
  "metadata": {
    "oldSalePrice": "...",
    "newSalePrice": "...",
    "oldPurchasePrice": "...",
    "newPurchasePrice": "..."
  }
}
```

Le contenu de `metadata` peut évoluer en fonction du type d'événement sans nécessiter une table relationnelle spécifique pour chaque forme d'activité.

**Fichier source :** `microservices/product-service/src/main/java/com/projectpos/productservice/product/service/ProductPriceService.java`

Cet extrait démontre la transmission d'un événement métier vers `activity-service`, après le changement de prix enregistré dans MySQL.

### Extrait d'implémentation : transmission de l'événement `PRICE_CHANGED`

Après l'enregistrement du nouveau prix dans MySQL, `product-service` transmet un événement de traçabilité à `activity-service`.

```java
activityClient.create(
        new CreateActivityEventRequest(
                "PRICE_CHANGED",
                null,
                "product-service",
                "PRODUCT",
                productId.toString(),
                Map.of(
                        "oldSalePrice", oldSalePrice,
                        "newSalePrice", salePrice,
                        "oldPurchasePrice", oldPurchasePrice,
                        "newPurchasePrice", purchasePrice
                )
        )
);
```

L'historique métier du prix reste stocké dans MySQL. MongoDB ne remplace donc pas `ProductPrice` : il conserve ici une trace d'activité complémentaire, dont les métadonnées peuvent varier selon le type d'événement.

Dans cette version, `userId` reste volontairement à `null`, car l'identité de l'utilisateur n'est pas transmise à `product-service`. Ce choix évite d'inventer une valeur ou de coupler ce service à la session HTTP.

L'appel à `activity-service` est encapsulé dans une gestion d'erreur afin que l'indisponibilité du journal d'activité ne bloque pas l'opération métier principale :

```java
try {
    activityClient.create(...);
} catch (Exception exception) {
    System.err.println(
            "Activity event could not be recorded: "
                    + exception.getMessage()
    );
}
```

Cette stratégie privilégie la disponibilité du changement de prix. Elle présente toutefois une limite connue : si `activity-service` est indisponible au moment de l'appel, l'événement n'est pas rejoué automatiquement. Une évolution vers un mécanisme de retry, une Outbox ou une messagerie asynchrone permettrait de fiabiliser cette transmission.

---

## 14.13 Pourquoi MongoDB pour les activités ?

Le journal d'activité présente des caractéristiques différentes des données transactionnelles principales.

Un événement :

- est principalement ajouté ;
- doit être consultable ultérieurement ;
- peut contenir des métadonnées variables ;
- n'a pas besoin des mêmes relations fortes qu'une vente ;
- ne nécessite pas d'être joint directement aux tables des autres services.

Le modèle documentaire permet de conserver l'événement et ses métadonnées dans une même structure.

MongoDB est donc utilisé ici pour un besoin ciblé.

Le choix ne signifie pas qu'une base NoSQL est systématiquement supérieure à une base relationnelle.

Pour les ventes, les utilisateurs et les produits, MySQL reste plus cohérent avec la structure des données du projet.

---

## 14.14 Immutabilité du journal d'activité

Le journal d'activité est conçu comme une suite d'événements historiques.

L'API de `activity-service` expose donc principalement :

```text
POST /api/v1/activities
GET  /api/v1/activities
GET  /api/v1/activities/type/{eventType}
GET  /api/v1/activities/entity/{entityType}/{entityId}
```

Aucune opération métier de type `PUT` ou `DELETE` n'a été ajoutée pour modifier ou supprimer les événements existants.

Ce choix est volontaire.

Un journal de traçabilité perdrait une partie de son intérêt si les événements pouvaient être librement réécrits après leur création.

Le CRUD complet est déjà mis en œuvre dans les domaines relationnels du projet ; il n'était donc pas pertinent d'ajouter artificiellement des opérations de modification au journal uniquement pour reproduire le même modèle avec MongoDB.

---

## 14.15 Accès aux données NoSQL

`activity-service` utilise Spring Data MongoDB pour accéder à la base documentaire.

Le repository permet de réaliser les opérations de persistance et les recherches nécessaires au service.

Des recherches spécifiques permettent notamment de filtrer les événements :

```text
par type d'événement
```

ou :

```text
par type d'entité et identifiant d'entité
```

Le contrôleur REST expose ces fonctionnalités aux autres composants de l'architecture.

L'accès à MongoDB reste ainsi encapsulé dans `activity-service`, comme les accès MySQL restent encapsulés dans leurs services respectifs.

---

### Preuve de code : repository Spring Data MongoDB

**Fichier source :** `microservices/activity-service/src/main/java/com/projectpos/activityservice/activity/repository/ActivityEventRepository.java`

Cette interface utilise `MongoRepository` et des méthodes de recherche dérivées pour consulter les événements par type ou par entité concernée.
Le fichier `ActivityEventRepository.java` contient les méthodes de recherche suivantes :

```java
public interface ActivityEventRepository
        extends MongoRepository<ActivityEvent, String> {

    List<ActivityEvent> findByEventTypeOrderByOccurredAtDesc(
            String eventType
    );

    List<ActivityEvent> findByEntityTypeAndEntityIdOrderByOccurredAtDesc(
            String entityType,
            String entityId
    );
}
```

Spring Data génère les requêtes correspondant à ces méthodes. Bien que `MongoRepository` fournisse également des méthodes de modification et de suppression, le contrôleur REST du journal n'expose pas de routes `PUT` ou `DELETE` : l'immutabilité est ici un choix du contrat API, pas une contrainte imposée par MongoDB.

---

## 14.16 Cohérence des données dans une architecture distribuée

La séparation des bases apporte une meilleure indépendance entre les domaines, mais elle modifie également la gestion de la cohérence.

Dans le monolithe, plusieurs modifications pouvaient être regroupées dans une même transaction SQL.

Dans la V2, une opération peut traverser plusieurs services.

La création d'une vente peut par exemple nécessiter :

```text
sale-service
      |
      +----> product-service
      |       retrait du stock
      |
      +----> base sale
              enregistrement vente
```

Ces opérations ne partagent pas une transaction SQL unique.

Une panne entre les deux opérations peut donc produire temporairement une incohérence.

Cette contrainte fait partie des conséquences du passage à une architecture distribuée.

Elle est connue dans le projet et pourrait être traitée ultérieurement par des mécanismes tels que :

- Saga ;
- opérations compensatoires ;
- Outbox Pattern ;
- messagerie asynchrone.

Ces mécanismes n'ont pas été ajoutés dans la V2 afin de conserver un périmètre maîtrisé.

---

## 14.17 Cohérence du journal d'activité

Le journal d'activité présente une problématique similaire.

L'opération métier principale et l'enregistrement de l'activité sont réalisés par deux services différents.

Dans le cas d'une modification de prix, l'échec de `activity-service` ne doit pas empêcher la modification du prix.

Le système privilégie donc l'opération métier principale.

Cette décision implique qu'un événement puisse ne pas être enregistré si le service d'activité est indisponible au moment de l'appel.

La V2 ne dispose pas encore d'un mécanisme automatique de reprise de ces événements.

Une évolution basée sur une file de messages ou sur l'Outbox Pattern permettrait d'améliorer cette garantie.

---

## 14.18 Tests des composants d'accès aux données

Les composants utilisant les données ont été intégrés à la stratégie de tests de la V2.

Pour les services SQL, les tests nécessitant un contexte Spring utilisent une base H2 en mémoire dans le profil de test.

Cette configuration concerne notamment :

```text
user-service
product-service
sale-service
```

Elle permet d'exécuter les tests sans dépendre des bases MySQL locales utilisées pendant le développement.

Les configurations de test désactivent également les dépendances externes inutiles à leur exécution.

Pour `activity-service`, les tests du contrôleur vérifient notamment :

- la création d'un événement ;
- le rejet d'une requête invalide ;
- le filtrage par type ;
- le filtrage par entité.

Cette isolation est également utilisée dans la chaîne d'intégration continue.

---

## 14.19 Comparaison des deux approches

Les deux technologies répondent finalement à des besoins différents dans PROJECT_POS.

| Critère | MySQL | MongoDB |
|---|---|---|
| Services | user, product, sale | activity |
| Modèle | Relationnel | Documentaire |
| Structure | Forte et prédéfinie | Plus flexible |
| Relations métier | Importantes | Limitées |
| Transactions métier | Importantes | Non centrales au cas d'usage |
| Données principales | Utilisateurs, produits, prix, ventes | Événements |
| Évolution des attributs | Schéma structuré | Métadonnées flexibles |
| Usage dans PROJECT_POS | Données opérationnelles | Traçabilité |

Le choix de la technologie de persistance est ainsi effectué en fonction du besoin métier et non uniquement en fonction de la technologie disponible.

---

## 14.20 Bilan SQL / NoSQL

L'évolution de PROJECT_POS a permis de travailler avec deux modèles de persistance complémentaires.

MySQL reste utilisé pour les données métier nécessitant une structure relationnelle forte :

```text
utilisateurs
produits
catégories
prix
ventes
lignes de vente
```

MongoDB est utilisé pour un besoin documentaire spécifique :

```text
journal d'activité
```

La V2 introduit également le principe de propriété des données par service.

Chaque microservice contrôle sa persistance et les autres services passent par son API plutôt que d'accéder directement à ses tables ou collections.

Cette évolution a permis de mettre en pratique :

- la conception de modèles relationnels ;
- l'accès aux données avec JPA ;
- les règles d'intégrité métier ;
- l'historisation des données ;
- la séparation des bases dans une architecture distribuée ;
- la persistance documentaire avec MongoDB ;
- l'accès aux données avec Spring Data MongoDB ;
- la réflexion sur la cohérence des données entre plusieurs services.

L'utilisation conjointe de SQL et NoSQL n'est donc pas un objectif isolé du projet.

Elle résulte du choix d'utiliser le modèle de données le plus adapté à la responsabilité de chaque service.
