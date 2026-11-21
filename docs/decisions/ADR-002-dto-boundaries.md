# ADR-002 — DTO Boundaries

## Status

Accepted

## Context

The backend uses JPA entities to represent database tables.

However, exposing JPA entities directly through REST endpoints would tightly couple the API contract to the persistence model.

This would make future changes harder, especially with the planned React frontend, API evolution and future microservices architecture.

## Decision

The REST API exposes only DTOs.

Entities are kept inside the backend.

The main DTO categories are:

- Request DTOs for input data
- Response DTOs for output data
- Specialized DTOs for read models such as dashboard and sales history

## Consequences

The API contract is more stable.

The persistence model can evolve without breaking API consumers.

Sensitive data can be hidden from responses.

For example, UserResponse never exposes the user's PIN code.

This approach improves security, maintainability and frontend integration.