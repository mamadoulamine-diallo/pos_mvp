# 14. Persistance des données : MySQL et MongoDB

## 14.1 Deux modèles de persistance pour deux besoins

Dans la V2 de PROJECT_POS, les données opérationnelles restent stockées dans **MySQL**, tandis que le journal d'activité est confié à **MongoDB**. Le choix du NoSQL ne remplace donc pas le modèle relationnel : il répond à un besoin de traçabilité dont les informations complémentaires varient selon l'événement.

| Technologie | Services concernés | Données conservées |
|---|---|---|
| MySQL, avec JPA/Hibernate | `user-service`, `product-service`, `sale-service` | Utilisateurs, catalogue, prix, stock et ventes |
| MongoDB, avec Spring Data MongoDB | `activity-service` | Événements du journal d'activité |

Chaque service accède à sa propre persistance. La séparation des bases et les appels entre services ont été présentés au chapitre 12 ; nous nous concentrons ici sur **l'implémentation documentaire**.

## 14.2 Le document `ActivityEvent`

Le journal conserve les opérations métier qu'il est utile de retracer. Dans le modèle documenté, un événement `ActivityEvent` contient les informations suivantes :

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

Les champs `eventType`, `sourceService`, `entityType` et `entityId` permettent de savoir **ce qui s'est produit, dans quel service et sur quelle ressource**. `occurredAt` situe l'événement dans le temps. `userId` permet d'indiquer un utilisateur lorsque cette information est disponible.

Le champ `metadata` est déterminant : il accueille des paires clé-valeur propres à chaque type d'événement. Un changement de prix peut contenir les anciens et les nouveaux montants, sans imposer ces attributs à tous les autres événements du journal.

### Exemple : événement `PRICE_CHANGED`

Le document ci-dessous illustre la structure décrite dans la version initiale du dossier. Les valeurs de prix sont volontairement schématiques ; il ne s'agit pas d'un export réel de MongoDB.

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

Contrairement à une ligne de table relationnelle aux colonnes prédéfinies, ce document regroupe les informations de l'événement et ses métadonnées dans une même structure. Cette souplesse correspond au besoin du journal, sans justifier de migrer les ventes ou les prix vers MongoDB.

## 14.3 Enregistrement d'un événement depuis `product-service`

L'exemple suivant, repris de la documentation technique du projet, montre la construction de la requête envoyée à `activity-service` après un changement de prix :

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

Trois instructions sont essentielles à la compréhension du mécanisme :

- **`activityClient.create(...)`** déclenche l'appel vers le service chargé du journal ; `product-service` n'écrit pas directement dans MongoDB.
- **`"PRICE_CHANGED"`** identifie la nature de l'opération enregistrée.
- **`Map.of(...)`** rassemble les anciennes et nouvelles valeurs dans les métadonnées de l'événement.

Le `userId` est ici transmis à `null` : dans cette implémentation, l'identité de l'utilisateur n'est pas propagée à `product-service`. Le journal décrit donc l'opération, mais ne permet pas systématiquement d'en identifier l'auteur.

**Deux historiques coexistent sans remplir la même fonction :** `ProductPrice` dans MySQL conserve les prix successifs nécessaires au métier ; `ActivityEvent` dans MongoDB garde la trace d'une opération de modification. La suppression du journal ne doit pas supprimer l'historique des prix.

## 14.4 Gestion de l'indisponibilité du journal

L'enregistrement de l'activité passe par un autre service et peut échouer indépendamment de la modification du prix. Le dossier initial présente une gestion d'erreur de cette forme :

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

Le `try` tente de transmettre l'événement ; le `catch` intercepte une exception et signale l'échec sans le relancer. **L'intention est de ne pas rendre le changement de prix dépendant de la disponibilité du journal.**

Ce choix comporte une conséquence précise : si l'appel échoue, l'événement n'est pas automatiquement conservé pour un nouvel envoi. Le système peut donc avoir un prix correctement mis à jour dans MySQL sans événement correspondant dans MongoDB. Le journal est une **traçabilité complémentaire**, et non un audit exhaustif garanti.

Une stratégie de reprise, par exemple une Outbox transactionnelle suivie d'une publication asynchrone, pourrait renforcer cette garantie. Elle n'est pas présentée comme réalisée dans la V2. Les risques transactionnels liés au stock et aux ventes sont détaillés au chapitre 12 et ne sont pas répétés ici.

## 14.5 Consultation et accès aux données MongoDB

`activity-service` utilise **Spring Data MongoDB** pour encapsuler l'accès aux documents. Le dossier décrit les opérations REST suivantes :

| Méthode | Endpoint | Fonction |
|---|---|---|
| `POST` | `/api/v1/activities` | Enregistrer un événement |
| `GET` | `/api/v1/activities` | Consulter le journal |
| `GET` | `/api/v1/activities/type/{eventType}` | Rechercher par type d'événement |
| `GET` | `/api/v1/activities/entity/{entityType}/{entityId}` | Retrouver les événements liés à une ressource |

Ces deux derniers endpoints répondent à des besoins de traçabilité concrets : retrouver les changements d'un produit ou consulter les événements d'une même catégorie.

L'API métier ne prévoit ni `PUT` ni `DELETE` pour les événements. Le journal est **conçu pour être consulté plutôt que réécrit**. Cela ne constitue toutefois pas une garantie technique d'immutabilité au niveau de la base : cette garantie demanderait des contrôles d'accès et des règles supplémentaires, non démontrés ici.

Les tests documentés pour le contrôleur vérifient la création d'un événement, le rejet d'une requête invalide et les recherches par type et par entité. Ces vérifications sont reprises dans la partie du dossier consacrée aux tests techniques ; elles ne prouvent pas, à elles seules, le comportement d'une instance MongoDB réelle.

## 14.6 Comparaison et bilan

| Critère | MySQL dans PROJECT_POS | MongoDB dans PROJECT_POS |
|---|---|---|
| Besoin | Données métier structurées | Journal d'activité |
| Organisation | Tables et relations | Documents avec métadonnées |
| Exemples | `Sale`, `SaleItem`, `ProductPrice` | `ActivityEvent` |
| Intégration Java | Spring Data JPA | Spring Data MongoDB |
| Enjeu principal | Intégrité des opérations métier | Souplesse et consultation des événements |

L'apport de MongoDB dans la V2 n'est pas une démonstration abstraite de la technologie : c'est **un cas d'usage limité et identifié**. Les opérations commerciales restent dans MySQL ; le journal documentaire reçoit les événements que les services lui transmettent.

Cette réalisation m'a permis d'expérimenter deux modes de persistance dans une même application distribuée et de comprendre leurs compromis. Le principal point de vigilance est la **fiabilité de la transmission des événements** : tant qu'aucun mécanisme de reprise n'est mis en place, certaines traces peuvent manquer en cas de panne.
