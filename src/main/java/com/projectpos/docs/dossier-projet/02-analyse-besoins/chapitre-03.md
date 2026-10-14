# 3. Analyse des besoins

## 3.1 Acteurs et usages

L’analyse du besoin distingue trois profils. Le **vendeur** utilise quotidiennement la caisse pour retrouver un produit, constituer un panier, enregistrer une vente et remettre un reçu. Le **gérant** administre le catalogue, les prix, les stocks et les utilisateurs, puis consulte les indicateurs d’activité. Enfin, le **propriétaire ou associé distant** souhaite suivre les résultats sans être présent dans la boutique. Ce dernier besoin constitue une orientation de la plateforme ; il ne signifie pas qu’un accès distant multi-boutiques est déjà livré dans le MVP.

## 3.2 Besoins fonctionnels

Le périmètre initial a été organisé autour de cinq ensembles fonctionnels :

- **Accès à l’application :** authentification par code PIN, identification du rôle vendeur ou gérant et gestion des comptes actifs.
- **Catalogue :** création et modification des catégories et produits, consultation du stock et activation ou désactivation des références.
- **Tarification :** définition d’un prix actif et conservation des anciens prix lors d’un changement de tarif.
- **Vente :** sélection des produits, gestion des quantités, validation du panier, décrémentation du stock et consultation du reçu et de l’historique.
- **Pilotage :** tableau de bord présentant notamment le chiffre d’affaires, le nombre de ventes, les articles vendus et les informations utiles au suivi du stock.

Le besoin de traçabilité porte à la fois sur les ventes enregistrées et sur la conservation des prix pratiqués. Le suivi exhaustif des encaissements, des versements et des mouvements financiers entre boutiques relève d’un périmètre ultérieur.

## 3.3 Besoins non fonctionnels

L’interface doit être accessible à des utilisateurs peu familiers des outils informatiques. La navigation privilégie donc des actions visibles, des écrans lisibles et des commandes adaptées au tactile.

La rapidité d’encaissement constitue un objectif de conception : le parcours de vente vise environ **30 secondes** pour une opération courante. Cette durée représente une cible métier, et non une performance mesurée ou garantie.

La fiabilité impose de conserver le prix réellement appliqué à une vente, même si le tarif du produit change ensuite, et de maintenir la cohérence entre validation de la vente et mise à jour du stock dans le MVP monolithique.

Enfin, la maintenabilité repose sur une séparation entre contrôleurs, services métier et accès aux données, afin de préparer l’évolution de l’application. L’authentification et la gestion des rôles constituent un premier niveau de contrôle d’accès ; leurs limites et leur évolution sont traitées dans le chapitre consacré à la sécurité.

## 3.4 Contraintes et périmètre

Le projet répond à un besoin réel de petites boutiques dont le suivi des ventes et du stock repose encore largement sur des méthodes manuelles. Il doit également permettre de démontrer les compétences attendues dans le cadre du titre de Concepteur Développeur d’Applications.

Pour livrer une première version exploitable, le MVP a été limité à la gestion d’un commerce, sans paiement intégré, synchronisation multi-boutiques ni application mobile native. Les évolutions vers React, les API REST puis les microservices sont présentées dans les chapitres suivants.

## 3.5 User stories et critères d’acceptation

Les user stories traduisent les besoins des utilisateurs en fonctionnalités observables. Pour chacune, les **critères d’acceptation** précisent les conditions permettant de considérer le comportement attendu comme satisfait. Ils servent de référence lors de la conception et de la validation fonctionnelle ; ils ne constituent pas, à eux seuls, la preuve qu’un test automatisé a été exécuté.

| Réf. | User story | Critères d’acceptation |
|---|---|---|
| **US01** | En tant que vendeur, je veux me connecter avec mon PIN pour accéder à la caisse. | Un PIN reconnu pour un compte actif ouvre une session ; un PIN invalide ne permet pas l’accès. |
| **US02** | En tant que vendeur, je veux ajouter un produit au panier pour préparer une vente. | Le produit sélectionné apparaît dans le panier avec son prix actif ; le total est recalculé. |
| **US03** | En tant que vendeur, je veux ajuster les quantités pour répondre à la demande du client. | La modification d’une quantité actualise le sous-total et le total ; la vente ne doit pas conduire à un stock négatif. |
| **US04** | En tant que gérant, je veux créer ou modifier un produit pour tenir le catalogue à jour. | Les informations valides sont enregistrées et visibles dans la liste des produits. |
| **US05** | En tant que gérant, je veux changer le prix d’un produit pour adapter son tarif. | Le nouveau prix devient actif ; l’ancien prix reste consultable ; une vente antérieure conserve son prix unitaire enregistré. |
| **US06** | En tant que gérant, je veux repérer les stocks faibles et les ruptures pour préparer le réapprovisionnement. | Les produits concernés sont identifiables à partir des quantités en stock et des règles d’affichage retenues. |
| **US07** | En tant que gérant, je veux consulter les résultats de la boutique pour suivre son activité. | Le tableau de bord affiche les indicateurs calculés à partir des ventes enregistrées. L’accès distant d’un associé relève des évolutions de la plateforme. |

**Exemple de scénario d’acceptation — US05, changement de prix**

- **Étant donné** un produit possédant un prix actif de 35 000 F et une vente déjà enregistrée à ce tarif ;
- **Lorsque** le gérant fixe son nouveau prix à 37 000 F ;
- **Alors** le catalogue affiche 37 000 F pour les nouvelles ventes, tandis que la vente précédente conserve 35 000 F sur sa ligne de vente.

Ce scénario relie une demande métier à deux choix de conception : l’historisation dans `ProductPrice` et l’enregistrement du prix appliqué dans `SaleItem.unitPrice`. Leur implémentation est détaillée au chapitre 8, puis leur vérification fonctionnelle au chapitre 9.

## 3.6 Synthèse

L’analyse a conduit à privilégier un parcours de vente simple, la maîtrise du catalogue et la traçabilité des opérations. Les critères d’acceptation rendent ces attentes vérifiables et servent de fil conducteur entre les besoins, les règles métier, le développement du MVP et sa validation.
