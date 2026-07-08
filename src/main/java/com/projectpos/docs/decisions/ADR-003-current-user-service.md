# ADR-003 — Current User Service

## Status

Accepted

## Context

The MVP uses HTTP sessions to identify the currently connected user.

The V1 will migrate progressively toward JWT authentication.

Using the HTTP session directly inside controllers or services would make the business logic dependent on the current authentication mechanism.

## Decision

A CurrentUserService is introduced as an abstraction layer between the security mechanism and the business logic.

In the MVP and early V1, it retrieves the current user from the HTTP session.

Later, it will retrieve the current user from JWT authentication without changing the business services.

## Consequences

Business services are not coupled to HTTP sessions.

The migration from session-based authentication to JWT will be easier.

Controllers remain cleaner.

The authentication strategy can evolve without rewriting the sale creation flow or other business use cases.