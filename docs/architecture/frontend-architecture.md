# Frontend Architecture — POS Platform

## Purpose

This document defines the frontend architecture of POS Platform.

Its objective is to provide a scalable, maintainable and predictable React application that can evolve from a single-store POS into a multi-company SaaS platform.

This document serves as the reference architecture for every frontend development.

---

# Architecture Overview

The frontend is organized around three major concepts.

```
Application

│

├── Features

├── Shared

└── App
```

Each layer has a single responsibility.

---

# App Layer

The App layer bootstraps the application.

Responsibilities:

- Router
- Providers
- Global configuration
- Application startup

Example

```
src/app

App.jsx

Providers.jsx

Router.jsx
```

The App layer should contain no business logic.

---

# Features

Features represent business domains.

Each feature is autonomous.

Example:

```
features/

dashboard/

products/

categories/

sales/

users/
```

Each feature owns:

- pages
- components
- api
- services
- hooks
- styles (if necessary)

Example

```
products/

api/

components/

hooks/

pages/

services/
```

A feature should never depend on another feature.

Communication between features happens through shared services or the backend API.

---

# Shared

The Shared layer contains reusable building blocks.

These components contain no business logic.

Examples:

```
shared/

api/

components/

hooks/

utils/

styles/
```

Examples of reusable components:

- Button
- Card
- Modal
- Table
- Input

---

# Global UI Services

Some frontend capabilities belong to the entire application rather than to a business feature.

Examples:

- Authentication
- Calculator
- Notifications
- Toasts
- Dialogs

These services are implemented using Providers and custom Hooks.

Example

```
shared/

calculator/

notification/

toast/

dialog/
```

Each Global UI Service exposes:

```
Provider

Context

Hook

Components
```

Business features only consume the Hook.

Example

```jsx
const { openCalculator } = useCalculator();
```

---

# Providers

Application Providers are initialized during application startup.

Example

```
<App>

    <Providers>

        <AuthProvider>

            <CalculatorProvider>

                <NotificationProvider>

                    <RouterProvider />

                </NotificationProvider>

            </CalculatorProvider>

        </AuthProvider>

    </Providers>

</App>
```

Providers should remain independent.

---

# API Layer

Every HTTP request is isolated inside the API layer.

Example

```
products/api/

productApi.js
```

Responsibilities:

- HTTP requests
- Axios
- Endpoints

Nothing else.

---

# Service Layer

Services orchestrate frontend logic.

Example

```
products/services/

productService.js
```

Responsibilities:

- transform API responses
- aggregate multiple requests
- prepare UI models

Services never render UI.

---

# Hooks

Custom hooks encapsulate reusable frontend behavior.

Examples:

```
useAuth()

useCalculator()

useProducts()
```

Hooks should expose a simple public API.

---

# Components

Components are divided into two categories.

## Feature Components

Used only inside one feature.

Example

```
products/components/

ProductCard

ProductModal

ProductForm
```

---

## Shared Components

Reusable everywhere.

Example

```
shared/components/

Button

Modal

Card

Table
```

---

# Layout

The application uses a single Main Layout.

```
MainLayout

Header

Sidebar

Content
```

The layout is independent from business features.

---

# Routing

React Router controls navigation.

Routes are grouped by feature.

Example

```
/

products

categories

sales

users
```

Authentication is handled by dedicated providers.

---

# State Management

The application follows three levels of state.

## Local State

Component state.

Example

```
useState()
```

---

## Feature State

State shared inside one feature.

Usually implemented using custom hooks.

---

## Global State

Shared across the entire application.

Implemented through Providers.

Examples

- Auth
- Calculator
- Notifications

---

# Styling

Styling follows Sass architecture.

```
assets/styles/

abstracts/

base/

components/
```

Feature-specific styles remain inside their feature when appropriate.

Naming convention follows BEM.

---

# Import Rules

Imports should always go from high-level to low-level.

Preferred order:

```jsx
React

Libraries

Shared

Features

Local files

Styles
```

Example

```jsx
import { useState } from "react";

import { Bell } from "lucide-react";

import useAuth from "../../../features/auth/hooks/useAuth";

import "./Header.scss";
```

---

# Naming Conventions

Components

```
ProductCard.jsx
```

Hooks

```
useProducts.js
```

Providers

```
AuthProvider.jsx
```

Contexts

```
AuthContext.js
```

Services

```
productService.js
```

API

```
productApi.js
```

---

# Guiding Principles

The frontend follows these principles.

## Single Responsibility

Each file has one responsibility.

---

## Low Coupling

Features remain independent.

---

## High Cohesion

Everything belonging to one feature stays together.

---

## Reusability

Shared code belongs to Shared.

---

## Composition

The application is built by composing features and services.

---

## Predictability

Every developer should know where new code belongs before writing it.

---

# Long-Term Vision

This architecture supports future evolutions including:

- Multi Store
- Multi Company
- SaaS
- Desktop
- Mobile
- Progressive Web App

without requiring major architectural changes.

---

# Summary

The frontend architecture is based on two complementary concepts.

**Business Features**

Implement business domains.

**Global UI Services**

Implement reusable application-wide capabilities.

Together they provide a scalable and maintainable architecture capable of supporting the long-term evolution of POS Platform.

# Golden Rule

When adding a new frontend capability, always ask the following question first:

**Is this a Business Feature or a Global UI Service?**

The answer determines where the code belongs.

Never start by creating files.

Start by choosing the correct architectural layer.