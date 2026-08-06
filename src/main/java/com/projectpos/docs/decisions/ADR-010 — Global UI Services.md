# ADR-010 — Global UI Services

## Status

Accepted

---

# Context

The POS Platform frontend follows a **Feature-Based Architecture**.

Each business domain owns its own feature:

- Dashboard
- Products
- Categories
- Sales
- Users

However, some frontend capabilities do not belong to any business domain.

These capabilities must remain accessible from anywhere in the application.

Examples:

- Authentication
- Calculator
- Notifications
- Confirmation dialogs
- Toast messages
- Themes
- Languages

These elements represent **Global UI Services** rather than business features.

---

# Problem

Without a clear architectural rule, these capabilities tend to be placed inside existing features.

Examples:

```text
dashboard/
    Calculator
```

or

```text
sales/
    Notification
```

This creates unnecessary coupling.

The calculator does not belong to Sales.

Notifications do not belong to Dashboard.

As the application grows, these components become difficult to reuse and maintain.

---

# Decision

Create a dedicated location for all cross-cutting frontend services.

```text
shared/
```

Each global service owns its own folder.

Example:

```text
shared/

auth/

calculator/

notification/

dialog/

toast/
```

Each service exposes:

- a Provider
- a Context
- a custom Hook
- UI components when necessary

---

# Standard Structure

Example:

```text
calculator/

CalculatorProvider.jsx

CalculatorContext.js

useCalculator.js

CalculatorModal.jsx

calculator.scss
```

Example:

```text
toast/

ToastProvider.jsx

ToastContext.js

useToast.js
```

The same structure should be used consistently across all Global UI Services.

---

# Usage

Business features never manipulate global UI components directly.

Instead, they consume the public Hook exposed by the service.

Example:

```jsx
const { openCalculator } = useCalculator();
```

```jsx
const { showToast } = useToast();
```

```jsx
const { confirm } = useDialog();
```

This guarantees loose coupling between business features and shared UI services.

---

# Responsibilities

Global UI Services are responsible only for user interface behavior.

They:

- do not contain business rules;
- do not manipulate JPA entities;
- do not access repositories directly;
- do not implement domain logic.

Their responsibility is limited to providing reusable UI capabilities.

---

# Providers

Global services are initialized when the application starts.

Example:

```text
<App>

    <Providers>

        <AuthProvider>

            <CalculatorProvider>

                <NotificationProvider>

                    <ToastProvider>

                        <RouterProvider />

                    </ToastProvider>

                </NotificationProvider>

            </CalculatorProvider>

        </AuthProvider>

    </Providers>

</App>
```

Each Provider is independent.

They can be added or removed without impacting business features.

---

# Architecture Principle

The frontend is composed of two distinct layers.

## Business Features

Business Features represent the application's functional domains.

Examples:

- Products
- Sales
- Dashboard
- Users

They implement business workflows and communicate with the backend.

---

## Global UI Services

Global UI Services represent reusable interface capabilities.

Examples:

- Authentication
- Calculator
- Notifications
- Dialogs
- Toasts

They provide shared user interface behavior without containing business logic.

---

# Decision Rule

Every new frontend capability should first answer the following question:

> **Is it a Business Feature or a Global UI Service?**

If the capability:

- is used by multiple features;
- contains no business rules;
- must be globally accessible;
- provides a reusable UI behavior;

then it should be implemented as a **Global UI Service**.

Otherwise, it belongs to a business feature.

---

# Benefits

This architecture provides:

- low coupling;
- high reusability;
- predictable project organization;
- easier maintenance;
- better scalability;
- clear separation of concerns.

---

# Impact

This decision prepares the platform for future evolutions such as:

- Multi Store
- Multi Company
- SaaS
- Desktop
- Mobile
- Progressive Web App (PWA)

Business modules remain independent from cross-cutting UI services.

---

# Planned Global UI Services

## Version 1

- AuthProvider
- CalculatorProvider
- NotificationProvider

## Future Versions

- ToastProvider
- DialogProvider
- ThemeProvider
- LanguageProvider
- CompanyProvider
- StoreProvider
- PermissionProvider
- SubscriptionProvider

---

# Consequences

Every future cross-cutting frontend capability should be implemented as a Global UI Service whenever it:

- is shared across multiple business features;
- contains no business logic;
- exposes a reusable interface behavior;
- needs to be globally accessible.

Business features should depend only on the public Hook exposed by each service and never on its internal implementation.

---

# Summary

The frontend architecture is based on two complementary concepts:

**Business Features** implement the application's business domains.

**Global UI Services** implement reusable user interface capabilities.

This separation ensures a scalable, maintainable and consistent frontend architecture while supporting the long-term evolution of the POS Platform into a SaaS ecosystem.