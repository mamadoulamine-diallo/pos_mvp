# ADR-009 — Centralized CORS Configuration

## Status

Accepted

## Context

The React frontend runs on `http://localhost:5173`, while the Spring Boot backend runs on `http://localhost:8080`.

Because these applications use different origins, the browser applies the Cross-Origin Resource Sharing policy.

The frontend must also send the HTTP session cookie while the application still uses session-based authentication.

## Decision

CORS is configured centrally in the Spring Boot backend through a dedicated configuration class.

The configuration:

- applies only to REST endpoints under `/api/**`;
- authorizes the React development origin;
- allows the required HTTP methods;
- accepts request headers;
- allows credentials for the HTTP session.

CORS annotations are not added individually to controllers.

## Consequences

All REST controllers follow the same CORS policy.

The configuration remains centralized and easier to maintain.

The Thymeleaf MVC routes are not exposed unnecessarily.

The current session-based authentication works with the React frontend.

The configuration can later evolve when the project migrates from HTTP sessions to JWT authentication.