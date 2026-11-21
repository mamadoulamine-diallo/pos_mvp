# ADR-004 — Dashboard as a Read Model

## Status

Accepted

## Context

The dashboard aggregates business information coming from multiple domain entities.

It combines data from:

- Sales
- Sale Items
- Products
- Inventory

Unlike Product or User, the dashboard does not represent a persistent entity stored in the database.

Its purpose is to provide business indicators for decision making.

## Decision

The dashboard is implemented as a collection of read models instead of a CRUD resource.

The API exposes specialized endpoints:

- /summary
- /top-products
- /recent-sales
- /revenue/day
- /revenue/month
- /revenue/year
- /stock-alerts

Each endpoint returns a business projection optimized for a specific dashboard widget.

## Consequences

The frontend loads only the information it needs.

The API remains focused on business use cases instead of database entities.

Each dashboard component can evolve independently.

The implementation follows the Command Query Responsibility Segregation (CQRS) principle by separating transactional operations (Sales) from reporting operations (Dashboard).

This design also prepares the platform for future analytics modules without modifying the sales domain.