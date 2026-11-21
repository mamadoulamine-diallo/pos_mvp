# ADR-008 — Frontend as a Client of the Platform

## Status

Accepted

## Context

The POS Platform is designed around a Spring Boot backend exposing a versioned REST API.

The React application is introduced as the first external client of this platform.

Future clients may include:

- Mobile applications
- Administration portals
- Third-party integrations
- E-commerce systems

The frontend should not contain business rules already implemented by the backend.

## Decision

The React application is considered a client of the platform.

Business logic remains exclusively inside the backend.

The frontend is responsible for:

- rendering the user interface;
- calling the REST API;
- managing navigation;
- handling user interactions;
- presenting business data.

Any validation related to business rules must be enforced by the backend.

## Consequences

The backend remains the single source of truth.

Business rules are implemented only once.

Different clients can consume the same API consistently.

The React application can evolve independently from the backend implementation.

This architecture also prepares the platform for future mobile applications and SaaS evolution.