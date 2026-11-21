# ADR-001 — Backend Layered Architecture

## Status

Accepted

## Context

The POS Platform backend started as a Spring Boot MVC application using Thymeleaf and MySQL.

The project needed to remain simple enough for the MVP while being structured enough to evolve toward a REST API, React frontend and later a distributed architecture.

## Decision

The backend follows a layered architecture:

- Controller
- Service
- Repository
- Database

Each business domain is organized in its own package:

- user
- category
- product
- sale
- dashboard
- shared

## Consequences

This structure separates responsibilities clearly.

Controllers handle HTTP requests.

Services contain business rules.

Repositories handle data access.

The architecture makes the backend easier to maintain, test and evolve.

It also allowed the REST API to be added without rewriting the business logic.