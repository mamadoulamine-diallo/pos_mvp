# ADR-006 — Platform Vision

## Status

Accepted

## Context

The project initially started as a Point of Sale (POS) application intended to manage products, inventory and sales for a single retail store.

During discussions with potential users, a broader business need emerged.

The main challenge was not registering sales.

The real challenge was supervising an entire commercial activity across several stores.

Business owners need to understand:

- where products are located;
- how inventory moves;
- how much each store has sold;
- how much cash has been returned;
- how much remains to be collected;
- the financial health of each store;
- supplier debt;
- the global performance of the business.

The POS is therefore only one operational component of a much larger business platform.

## Decision

The project evolves from a simple POS application to a Commercial Supervision Platform.

The current MVP validates the core business modules:

- Products
- Categories
- Inventory
- Sales
- Dashboard

Future versions will progressively introduce:

- Companies
- Stores
- Suppliers
- Purchase Orders
- Stock Transfers
- Cash Remittances
- Subscriptions
- Multi-company management

The architecture will always favor progressive evolution instead of complete rewrites.

## Consequences

Every architectural decision must support long-term evolution.

The backend is designed as an independent business platform.

The React frontend becomes one consumer of the platform.

Future mobile applications, e-commerce integrations and external systems will consume the same REST API.

This vision reduces technical debt and ensures that new business capabilities can be introduced incrementally.

## Long-Term Vision

The long-term objective is to provide a SaaS platform capable of supervising commercial activities for both single-store and multi-store businesses.

The value of the platform is not limited to processing sales.

Its primary value is providing business owners with a complete and reliable view of:

- inventory;
- sales;
- financial flows;
- store performance;
- supplier commitments;
- overall business health.