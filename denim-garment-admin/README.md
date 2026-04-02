# Denim Garment Admin

Admin panel for managing stock incomes, suppliers, and reporting for the denim garment system.

## Scope

This README focuses on:
- reusable components in the admin UI
- CRUD coverage and API mapping
- validation behavior (frontend and backend)
- search and filtering behavior

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Backend API: Node.js + Express (`denim-garment-api`)
- Persistence: MongoDB (through the API)

## Project Structure (Admin)

- `src/app/layouts`
  - `AppShell.tsx`
  - `Sidebar.tsx`
  - `Topbar.tsx`
- `src/app/router`
  - `AppRouter.tsx`
- `src/app/context`
  - `AdminAuthContext.tsx`
- `src/components/charts`
  - `BarChartCard.tsx`
  - `DonutChartCard.tsx`
- `src/components/forms`
  - `DateField.tsx`
  - `SearchField.tsx`
  - `SelectField.tsx`
- `src/components/tables`
  - `DataTable.tsx`
  - `ActionIconGroup.tsx`
- `src/components/ui`
  - `Card.tsx`
  - `Modal.tsx`
  - `PageHeader.tsx`
  - `PrimaryButton.tsx`
- `src/components/feedback`
  - `StatusBadge.tsx`
- `src/pages`
  - `LoginPage.tsx`
  - `DashboardPage.tsx`
  - `PurchasesPage.tsx` (stock incomes)
  - `SuppliersPage.tsx`
  - `ReportsPage.tsx`

## Route and Permission Overview

Admin routes:
- `/dashboard`
- `/stock-incomes` (`/purchases` redirects here)
- `/suppliers`
- `/reports` (admin role only)

Access control:
- unauthenticated users are redirected to `/login`
- report page is blocked for non-admin roles
- delete actions in UI are restricted to admin role

## CRUD Coverage

### Stock Incomes

UI module:
- `src/pages/purchases/PurchasesPage.tsx`

API endpoints:
- `GET /api/stock-incomes?query=&status=`
- `POST /api/stock-incomes`
- `PATCH /api/stock-incomes/:incomeId`
- `DELETE /api/stock-incomes/:incomeId`

Alias endpoints (same behavior):
- `GET /api/purchases`
- `POST /api/purchases`
- `PATCH /api/purchases/:orderId`
- `DELETE /api/purchases/:orderId`

Supported operations in UI:
- Read list
- Create (modal form)
- Update (modal form)
- Delete (confirm modal)
- View details (read-only modal)

### Suppliers

UI module:
- `src/pages/suppliers/SuppliersPage.tsx`

API endpoints:
- `GET /api/suppliers?query=`
- `POST /api/suppliers`
- `PATCH /api/suppliers/:supplierId`
- `DELETE /api/suppliers/:supplierId`

Supported operations in UI:
- Read list
- Create (modal form)
- Update (modal form)
- Delete (confirm modal)

## Validation Rules

Validation is enforced in both frontend forms and backend API.

### Stock Income Validation

Fields:
- `supplier`
- `receivedDate`
- `materialLots`
- `stockValue`
- `status`

Rules:
- Supplier must be selected and must exist in supplier catalog.
- Received date must be a valid calendar date.
- Received date cannot be in the future.
- Material lots must be a whole number with minimum `1`.
- Stock value must be numeric with minimum `1000`.
- Status must be one of:
  - `Received`
  - `Quality Checked`
  - `Pending Inspection`

### Supplier Validation

Fields:
- `name`
- `contact`
- `email`

Rules:
- Name is required, trimmed/normalized, length `2-80`.
- Name allows controlled characters only.
- Contact is required, normalized, length `7-30`.
- Contact must match phone-style pattern and include `7-15` digits.
- Email is required, normalized to lowercase.
- Email max length is `254`.
- Email local-part max length is `64`.
- Email domain format is validated.
- Supplier name must be unique.
- Supplier email must be unique.
- Supplier name cannot be changed if stock income history exists for that supplier.
- Supplier cannot be deleted if stock income history exists.

### Auth Validation

- Admin endpoints require bearer token from admin login.
- Invalid or missing token returns auth errors.

## Search and Filter Behavior

### Stock Income Search

- Search input from `SearchField` is sent as `query`.
- Backend search is case-insensitive and trimmed.
- Matches:
  - income ID
  - supplier name
- Optional status filter is combined with search query.

### Supplier Search

- Search input from `SearchField` is sent as `query`.
- Backend search is case-insensitive and trimmed.
- Matches:
  - supplier ID
  - supplier name
  - supplier email

## API Contract Notes

- Admin app uses `/api` base path by default.
- Query string helper removes empty values.
- API persists mutations to MongoDB through server-side persistence.

## Run Locally

1. Start MongoDB service

```bash
brew services start mongodb/brew/mongodb-community@8.0
```

2. Start API

```bash
cd ../denim-garment-api
npm install
npm run start
```

3. Start Admin UI

```bash
cd ../denim-garment-admin
npm install
npm run dev
```

## Default Admin Accounts (Seed)

- `admin@dermas.com` / `admin123` (admin)
- `inventory@dermas.com` / `stock123` (inventory manager)

## Quick QA Checklist

- Stock income create blocks future dates.
- Stock income create blocks lots below 1.
- Stock income create blocks stock value below 1000.
- Supplier create/update blocks invalid email and invalid phone formats.
- Supplier delete is blocked if supplier has stock history.
- Stock income search returns expected rows for ID and supplier text.
- Supplier search returns expected rows for ID, name, and email text.
