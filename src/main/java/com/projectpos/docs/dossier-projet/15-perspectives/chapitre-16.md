# 16. Bilan du projet, limites et perspectives

## 16.1 Bilan des réalisations

PROJECT_POS est né d'un besoin concret : remplacer le suivi manuel des ventes et des stocks par une application utilisable au quotidien dans de petites boutiques. Sa réalisation a suivi trois étapes complémentaires.

| Étape | Réalisation principale | Apport au projet |
|---|---|---|
| **MVP** | Application Spring Boot et Thymeleaf avec catalogue, prix historisés, ventes, stock et tableau de bord | Validation des règles métier et des premiers parcours utilisateurs |
| **V1** | API REST, DTO et interface React consommant les services du backend | Séparation de l'interface et de la logique métier |
| **V2** | Microservices, communications REST/OpenFeign, infrastructure Spring Cloud, MySQL et MongoDB | Expérimentation et validation locale d'une architecture distribuée |

Le développement n'a pas consisté à repartir de zéro à chaque version. Les règles de gestion du MVP ont été réutilisées et adaptées. En revanche, la V2 a introduit des contraintes nouvelles : appels réseau, bases indépendantes, traitement des erreurs et validation des échanges entre services.

La dernière version constitue un **socle technique testé dans un environnement local**, et non une solution prête à être déployée telle quelle dans plusieurs commerces.

## 16.2 Difficultés rencontrées et enseignements

Les incidents rencontrés ont joué un rôle important dans l'évolution du projet. Ils ont conduit à vérifier les hypothèses de conception et à améliorer la reproductibilité des développements.

| Difficulté rencontrée | Réponse apportée | Enseignement |
|---|---|---|
| Conflit lors du changement de prix actif | Clôturer l'ancien tarif avant d'enregistrer le nouveau | L'ordre des opérations de persistance fait partie de la règle métier |
| Échanges entre services indépendants | Mettre en place les clients OpenFeign et vérifier les routes | Une opération distribuée doit être testée de bout en bout |
| Dépendance des tests à l'environnement local | Isoler les tests avec un profil adapté et H2 | Un test reproductible ne doit pas dépendre de la base de développement |
| Exécution de Maven dans GitHub Actions | Adapter le Maven Wrapper aux contraintes de l'environnement Linux | Une compilation locale réussie ne garantit pas une exécution identique en CI |

La mise en place de tests automatisés, de scénarios Postman et d'une chaîne GitHub Actions a fait évoluer ma méthode de travail. Une fonctionnalité n'était plus seulement considérée comme terminée lorsqu'elle semblait fonctionner dans l'interface : il fallait également vérifier son comportement et limiter les régressions.

## 16.3 Compétences mobilisées

Ce projet m'a permis de relier les compétences du titre de Concepteur Développeur d'Applications à un même produit, depuis l'analyse métier jusqu'à la validation technique.

| Domaine | Mise en pratique |
|---|---|
| Analyse et conception | Recueil des besoins, user stories, critères d'acceptation, modélisation MERISE et choix d'architecture |
| Développement applicatif | Java, Spring Boot, API REST, DTO, React et intégration frontend/backend |
| Persistance | MySQL pour les données transactionnelles, MongoDB pour les événements d'activité |
| Sécurité | Authentification, validation des entrées, gestion des erreurs et identification des protections à renforcer |
| Tests et livraison | JUnit, Mockito, Postman, Docker Compose et GitHub Actions |

Au-delà des outils, le travail a renforcé mon autonomie dans l'analyse des anomalies, la lecture des logs, la recherche de solutions et la justification des décisions techniques. Il m'a aussi appris à distinguer une démonstration fonctionnelle d'une garantie réellement apportée par l'architecture.

## 16.4 Limites et priorités techniques

Les validations réalisées attestent du fonctionnement des parcours testés, mais ne suffisent pas à garantir une exploitation commerciale en production.

La priorité concerne la **cohérence des opérations distribuées** : si le stock est décrémenté dans `product-service` et que l'enregistrement échoue ensuite dans `sale-service`, les deux bases peuvent devenir incohérentes. Ce scénario est détaillé au chapitre 12. Une évolution devra prévoir un traitement de reprise ou de compensation, avec des mécanismes adaptés tels qu'une Saga.

Le journal d'activité présente une autre limite : un événement peut être perdu lorsque sa transmission échoue, faute de mécanisme durable de reprise. Une publication fiable, par exemple avec un Outbox Pattern, reste à étudier.

Enfin, une mise en production demanderait de renforcer les autorisations, la gestion des secrets, les communications sécurisées, les sauvegardes et l'observabilité. La chaîne actuelle réalise de **l'intégration continue**, mais pas encore de déploiement continu en production.

## 16.5 Perspectives métier

L'évolution de PROJECT_POS doit désormais être guidée par la fiabilité des données et les besoins des commerçants, plutôt que par l'ajout de technologies.

| Horizon | Priorité | Valeur attendue |
|---|---|---|
| Court terme | Stabiliser les parcours React et les traitements distribués | Une utilisation cohérente de bout en bout |
| Moyen terme | Sécuriser les flux, fiabiliser les événements et préparer le déploiement | Une exploitation plus robuste |
| Long terme | Introduire plusieurs boutiques, la consolidation et le suivi financier | Une supervision commerciale centralisée |

Le besoin le plus structurant identifié auprès des commerçants dépasse la simple caisse. Lorsqu'une marchandise est fournie à crédit et distribuée entre plusieurs boutiques, le responsable doit pouvoir distinguer les **ventes enregistrées**, les **sommes encaissées** et les **versements effectivement remontés**. Cette traçabilité financière n'est pas couverte par le périmètre actuel et constitue une orientation majeure pour le produit.

Une plateforme multi-boutiques nécessitera également une isolation rigoureuse des données par établissement, des droits adaptés aux rôles et des indicateurs consolidés fiables.

## 16.6 Conclusion personnelle

PROJECT_POS m'a permis de mener un projet logiciel à partir d'un besoin réel, de confronter les choix de conception aux difficultés d'implémentation et de mesurer l'importance des tests et de la documentation.

Le passage du monolithe aux microservices a surtout montré qu'une architecture plus complexe n'est pas automatiquement une meilleure solution : elle apporte des possibilités de découpage, mais aussi des risques supplémentaires de communication et de cohérence.

La réussite du projet tient donc autant à la compréhension des processus commerciaux qu'à la maîtrise des technologies. Ce dossier présente les réalisations, les vérifications et les limites identifiées ; il constitue une base pour poursuivre le développement d'une solution de supervision commerciale réellement exploitable.
