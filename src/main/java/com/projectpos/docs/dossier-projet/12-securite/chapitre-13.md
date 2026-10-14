# 13. Sécurité de l'application

## 13.1 Objectifs et périmètre

PROJECT_POS manipule des comptes utilisateurs, des ventes, des prix, des stocks et des paramètres de connexion aux bases de données. La sécurité a donc été intégrée progressivement, d'abord dans le monolithe, puis lors de l'exposition des API REST et de la migration vers les microservices.

Les mécanismes présentés dans ce chapitre concernent l'authentification par PIN, la gestion des sessions HTTP, la validation des données entrantes, le traitement des erreurs et la protection des secrets de configuration. Leur mise en œuvre correspond au périmètre de développement et de démonstration de PROJECT_POS ; elle ne constitue pas à elle seule une sécurisation complète pour une exploitation publique.

## 13.2 Authentification par PIN et session HTTP

L'interface de caisse doit permettre à un vendeur de s'identifier rapidement. Chaque utilisateur dispose d'un PIN et d'un rôle métier, `VENDEUR` ou `GERANT`. Le contrôleur `AuthApiController` expose trois routes sous `/api/v1/auth` :

| Méthode | Route | Fonction |
|---|---|---|
| `POST` | `/login` | Authentifier l'utilisateur et ouvrir sa session |
| `GET` | `/me` | Récupérer l'utilisateur connecté |
| `POST` | `/logout` | Invalider la session |

Le traitement de connexion est implémenté dans `src/main/java/com/projectpos/user/controller/AuthApiController.java` :

```java
@PostMapping("/login")
public UserResponse login(
        @Valid @RequestBody LoginRequest request,
        HttpSession session
) {
    try {
        AppUser user = userService.authenticate(request.pinCode());
        session.setAttribute("currentUser", user);
        return userService.toResponse(user);
    } catch (IllegalArgumentException exception) {
        throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, exception.getMessage()
        );
    }
}
```

`@RequestBody` transforme le JSON reçu en `LoginRequest` et `@Valid` déclenche les contraintes de validation. Le contrôleur délègue la vérification du PIN à `UserService`, puis enregistre l'utilisateur authentifié sous la clé `currentUser` dans la session serveur. Il renvoie un `UserResponse`, plutôt que d'exposer directement l'entité persistée.

Dans `UserService`, la recherche est limitée aux utilisateurs actifs :

```java
public AppUser authenticate(String pinCode) {
    return repository.findByPinCodeAndActiveTrue(pinCode)
            .orElseThrow(() ->
                    new IllegalArgumentException("PIN invalide"));
}
```

La méthode du repository associe donc deux conditions : correspondance du PIN et activation du compte. Si aucun utilisateur ne satisfait ces conditions, l'exception est convertie par le contrôleur en réponse `401 Unauthorized`.

Pour les requêtes suivantes, `/me` relit `currentUser` dans la session. En son absence, le contrôleur renvoie également `401 Unauthorized`. La déconnexion appelle `session.invalidate()` et répond avec le statut `204 No Content`.

## 13.3 Conservation de la session entre React et l'API

La séparation du frontend React et du backend Spring Boot impose de conserver les informations de session lors des appels HTTP. Le fichier `pos-platform-ui/src/shared/api/axiosClient.js` configure un client commun :

```javascript
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});
```

La propriété `withCredentials: true` autorise l'envoi des cookies lors des requêtes concernées. Le navigateur peut ainsi transmettre le cookie de session reçu après la connexion ; Spring retrouve alors la session correspondante côté serveur. L'adresse de l'API provient d'une variable de configuration Vite, ce qui évite de la coder directement dans chaque composant React.

Ce mécanisme suppose une configuration cohérente des origines autorisées, des attributs du cookie et du déploiement HTTP ou HTTPS. `withCredentials` ne constitue pas, à lui seul, une politique CORS ni une protection contre les requêtes intersites.

Dans la V2 distribuée, la conservation de ce modèle implique aussi de prendre en compte l'identification de l'utilisateur lors des échanges entre services. La propagation d'un cookie ne garantit pas automatiquement que tous les services partagent la même session ou appliquent les mêmes contrôles d'accès.

## 13.4 Validation des requêtes et contrôles métier

La validation doit être effectuée côté serveur : les vérifications réalisées dans React peuvent être contournées par un appel HTTP direct. PROJECT_POS utilise des DTO pour définir les données acceptées par ses endpoints et Jakarta Validation pour certaines contraintes.

Le DTO d'authentification, `src/main/java/com/projectpos/user/dto/LoginRequest.java`, fournit un exemple simple :

```java
public record LoginRequest(
        @NotBlank String pinCode
) {}
```

`@NotBlank` refuse un PIN absent, vide ou composé uniquement d'espaces. La présence de `@Valid` sur le paramètre du contrôleur déclenche cette validation avant l'appel au service.

La validation de forme ne remplace pas les règles métier. Le service vérifie notamment que le PIN correspond à un utilisateur actif ; d'autres services contrôlent l'existence des produits, la disponibilité du stock ou la validité des opérations demandées. Ces vérifications restent nécessaires même si la requête respecte le format du DTO.

Le service `CurrentUserService` fournit également un accès centralisé à l'utilisateur de session :

```java
public AppUser getCurrentUser(HttpSession session) {
    AppUser currentUser =
            (AppUser) session.getAttribute("currentUser");

    if (currentUser == null) {
        throw new IllegalArgumentException(
                "Utilisateur non connecté");
    }
    return currentUser;
}
```

Cette méthode permet à un service appelant de détecter l'absence d'utilisateur connecté. Sa présence dans le projet ne signifie cependant pas que chaque route REST l'invoque systématiquement : la protection d'un endpoint dépend de son utilisation effective dans le chemin d'exécution.

## 13.5 Gestion centralisée des exceptions

Une erreur applicative doit être compréhensible pour le frontend sans imposer au client de traiter une trace Java. Dans la branche V1, `GlobalExceptionHandler` centralise notamment les erreurs de validation des DTO :

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiError handleValidationException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        String message = exception.getBindingResult()
                .getFieldErrors().stream().findFirst()
                .map(error -> error.getField() + " : "
                        + error.getDefaultMessage())
                .orElse("Données invalides");

        return new ApiError(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                message,
                request.getRequestURI()
        );
    }
}
```

`@RestControllerAdvice` mutualise le traitement des exceptions pour les contrôleurs REST. `@ExceptionHandler` sélectionne ici les erreurs déclenchées par Jakarta Validation. Le traitement récupère le premier champ en erreur et construit un objet `ApiError` contenant une date, un code, un libellé, un message et le chemin de la requête.

Il faut distinguer le **code présent dans le JSON** du **statut HTTP effectivement envoyé**. Dans cet extrait, `HttpStatus.BAD_REQUEST.value()` renseigne le corps de la réponse, mais aucune annotation `@ResponseStatus` ni aucun `ResponseEntity` ne fixe explicitement le statut HTTP à 400. Le gestionnaire doit donc être complété si l'on souhaite garantir cette correspondance pour toutes les erreurs de validation.

Le contrôleur d'authentification utilise, quant à lui, `ResponseStatusException(HttpStatus.UNAUTHORIZED, ...)` pour imposer explicitement un statut HTTP 401 lors du refus d'un PIN.

## 13.6 Externalisation et rotation des secrets

La configuration de l'infrastructure a fait apparaître un risque concret : des identifiants MySQL avaient été placés directement dans des fichiers de configuration. Une valeur commitée peut rester accessible dans l'historique Git même après sa suppression du dernier commit.

La configuration de la V2 a été modifiée pour séparer les paramètres versionnés des valeurs sensibles. Le fichier local `microservices/.env`, exclu du suivi Git par `.gitignore`, fournit la variable `MYSQL_ROOT_PASSWORD` utilisée par Docker Compose. Les configurations Spring Cloud Config emploient une référence à la variable d'environnement :

```properties
${MYSQL_ROOT_PASSWORD}
```

La valeur est ainsi fournie au lancement des services, au lieu d'être répétée dans les fichiers de configuration publiés. Les identifiants exposés précédemment ont également été renouvelés dans le cadre de cette correction.

Cette démarche réduit le risque de divulgation par le dépôt, sans remplacer une gestion de secrets dédiée. En particulier, un mot de passe administrateur MySQL ne devrait pas devenir le compte courant d'une application en production : des utilisateurs SQL spécifiques, dotés des seuls droits nécessaires, seraient préférables.

## 13.7 Sécurité dans l'architecture distribuée

La V2 sépare les données des domaines utilisateur, produit et vente. Cette séparation évite qu'un service modifie directement les tables d'un autre domaine : les échanges passent par les API du service propriétaire.

Elle n'assure toutefois pas automatiquement l'autorisation des opérations. Une API peut être correctement isolée sur le plan des données tout en acceptant une requête d'un utilisateur insuffisamment habilité. De même, les rôles `VENDEUR` et `GERANT` existent dans le modèle, mais leur présence ne démontre pas à elle seule un contrôle d'accès appliqué à chaque endpoint sensible.

Le journal d'activité MongoDB améliore la traçabilité des opérations métier ; il ne constitue pas une preuve d'audit infalsifiable. Les questions de disponibilité du journal et de transmission des événements sont traitées dans le chapitre consacré à la persistance NoSQL.

Les principaux renforcements nécessaires à une exploitation commerciale comprennent le hachage adapté des PIN, l'autorisation par rôle, la protection CSRF lorsque l'authentification repose sur des cookies, le paramétrage des cookies et de CORS, HTTPS, la restriction des accès d'administration et la gestion de comptes de base de données à privilèges minimaux.

## 13.8 Bilan

La sécurité de PROJECT_POS repose sur plusieurs mécanismes observables dans le code : authentification d'un utilisateur actif, session HTTP, échanges React/API avec cookies, validation des DTO et centralisation d'une partie des erreurs. L'externalisation des secrets a également répondu à un problème rencontré pendant la mise en place de l'infrastructure.

Ces réalisations constituent un socle pour la démonstration de la V2. Elles permettent aussi d'identifier les contrôles à renforcer avant un déploiement destiné à de véritables boutiques, notamment l'application systématique des autorisations, la protection des identifiants et la sécurisation des échanges entre services.
