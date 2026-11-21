# ADR-007 — Feature-Based Frontend Architecture

## Status

Accepted

## Context

The V1 introduces a React frontend consuming the REST API exposed by the Spring Boot backend.

Traditional React projects are often organized by technical layers such as:

- components
- pages
- hooks
- services

As projects grow, this structure becomes difficult to maintain because files belonging to the same business domain are scattered across multiple directories.

The POS Platform is expected to evolve into a commercial supervision platform with many business domains.

## Decision

The React application is organized using a Feature-Based Architecture.

Each business domain owns its own directory.

Example:

- auth
- dashboard
- products
- categories
- sales
- users

Each feature contains its own:

- pages
- components
- hooks
- services
- api
- types

Shared resources remain inside the shared module.

## Consequences

Frontend and backend share the same business vocabulary.

Each feature becomes independent.

Business functionality is easier to locate, maintain and evolve.

The architecture naturally supports team collaboration.

This organization also prepares the frontend for future SaaS modules such as:

- companies
- stores
- suppliers
- subscriptions
- stock transfers
- financial flows

without requiring a global reorganization of the project.

## Long-Term Vision

The frontend mirrors the business domains exposed by the backend.

Each feature communicates with its corresponding REST endpoints.

This symmetry reduces cognitive load, improves maintainability and simplifies the future transition toward a microservices architecture.