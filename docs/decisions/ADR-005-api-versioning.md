# ADR-005 — REST API Versioning

## Status

Accepted

## Context

The POS Platform backend is designed to serve multiple clients:

- React frontend
- Future mobile applications
- External integrations
- Future microservices

Once an API is consumed by external clients, its endpoints become a contract.

Breaking this contract would require updating every client simultaneously, making future evolution difficult.

## Decision

All REST endpoints are versioned using the following convention:

/api/v{version}/{resource}

Current version:

/api/v1

Examples:

- /api/v1/products
- /api/v1/categories
- /api/v1/users
- /api/v1/sales
- /api/v1/dashboard

Future breaking changes will be introduced through new API versions rather than modifying existing endpoints.

## Consequences

The API contract becomes stable.

Existing clients continue to work even when new API versions are introduced.

The platform can evolve progressively without forcing immediate frontend migrations.

This strategy prepares the project for long-term maintenance and future SaaS deployments.