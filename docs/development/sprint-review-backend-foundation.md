# Sprint Review — Backend Foundation

## Sprint

Backend Foundation

Status:

Completed

---

# Objective

Transform the initial Spring Boot MVC application into a reusable business platform exposing a professional REST API.

The backend should become independent from its presentation layer and ready to support a React frontend.

---

# Planned Deliverables

✓ Layered Architecture

✓ Business Services

✓ REST API

✓ DTO Separation

✓ Validation

✓ Global Exception Handling

✓ API Versioning

✓ OpenAPI Documentation

✓ API Contract

✓ Architecture Documentation

✓ Architecture Decision Records (ADR)

---

# Achievements

## Business Model

The MVP validates the core business domains:

- Users
- Categories
- Products
- Product Prices
- Sales
- Sale Items
- Dashboard

The business model has been stabilized before starting the frontend.

---

## Backend Architecture

The backend follows a layered architecture:

Controller

↓

Service

↓

Repository

↓

Database

Business rules remain inside the service layer.

---

## REST API

The backend now exposes a versioned REST API.

Convention:

/api/v1/{resource}

Main resources:

- Products
- Categories
- Users
- Sales
- Dashboard

The REST API is now the primary interface of the platform.

---

## API Documentation

The API is documented using OpenAPI.

Swagger UI provides:

- endpoint discovery
- request documentation
- response documentation
- DTO visualization

The API documentation is automatically synchronized with the source code.

---

## Documentation

The project now contains:

README

Architecture documents

API Contract

React Architecture

Development Guide

Architecture Decision Records

The documentation has become part of the project architecture.

---

## Technical Decisions

The following architectural decisions have been documented:

ADR-001

Layered Architecture

ADR-002

DTO Boundaries

ADR-003

Current User Service

ADR-004

Dashboard Read Model

ADR-005

REST API Versioning

ADR-006

Platform Vision

ADR-007

Feature-Based React Architecture

---

# Lessons Learned

Several important software engineering principles emerged during this sprint.

Business rules must remain independent from presentation.

REST APIs should be treated as long-term contracts.

Documentation is an architectural asset.

Good architecture reduces future complexity.

Decisions deserve to be documented.

---

# Risks

Current authentication still relies on HTTP Session.

JWT authentication remains the next major backend milestone.

The MVC layer is still present until the React migration is completed.

---

# Ready for Next Sprint

The backend is considered stable enough to start the React frontend.

Future work will focus on:

- React Foundation
- JWT Authentication
- Progressive replacement of Thymeleaf pages

without modifying the existing business services.

---

# Conclusion

The project has evolved from a traditional Spring MVC application into a business platform exposing a documented and versioned REST API.

This backend now serves as the foundation for the future React frontend and the long-term SaaS vision of the platform.