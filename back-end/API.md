# Hishab Khata SaaS Backend API Documentation

Base URL: `http://localhost:8000/api/`  

All endpoints are **JWT protected** unless explicitly marked as public.

---

## Authentication

### 1. Obtain Token

**POST** `/token/`  _(SimpleJWT default)_

**Request Body:**

```json
{
  "email": "owner@test.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

> Use `access` token in Authorization header:
> `Authorization: Bearer <access_token>`

---

### 2. Refresh Token

**POST** `/token/refresh/`

```json
{
  "refresh": "<refresh_token>"
}
```

**Response:**

```json
{
  "access": "<new_access_token>"
}
```

---

## Users / Accounts

> Multi-tenant: `business` automatically applied from token.

### 1. Get current user

**GET** `/accounts/me/`

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "id": "uuid",
  "email": "owner@test.com",
  "name": "Owner Name",
  "role": "OWNER",
  "business": "Test Business"
}
```

---

## Businesses

### 1. List Businesses *(admin only)*

**GET** `/businesses/`

### 2. Get Business Detail

**GET** `/businesses/<id>/`

### 3. Create Business + Owner *(optional)*

**POST** `/businesses/`

```json
{
  "name": "New Business",
  "owner_email": "owner@example.com",
  "owner_password": "123456"
}
```

---

## Products

> All requests automatically filter by `business`.

### 1. List Products

**GET** `/products/products/`

Query parameters:

* `search`: search by name or SKU
* `page`: pagination

**Response:**

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "name": "Product 1",
      "sku": "P001",
      "price": 100
    }
  ]
}
```

### 2. Create Product

**POST** `/products/products/`

```json
{
  "name": "New Product",
  "sku": "P002",
  "price": 120
}
```

### 3. Get Product Detail

**GET** `/products/products/<id>/`

### 4. Update Product

**PUT** `/products/products/<id>/`

```json
{
  "name": "Updated Product",
  "price": 150
}
```

### 5. Delete Product

**DELETE** `/products/products/<id>/`

---

## Inventory

* **Stock**: `/inventory/stocks/`
* **StockTransaction**: `/inventory/transactions/`

CRUD endpoints follow **same pattern** as products.

---

## Sales

* **Order**: `/sales/orders/`
* **OrderItem**: `/sales/order-items/`
* **Payment**: `/sales/payments/`

All endpoints filter by **business from token**.

---

## Finance

* **Expense**: `/finance/expenses/`
* **FinancialTransaction**: `/finance/transactions/`

---

## Reports (read-only)

* **GET** `/reports/sales-summary/`
* **GET** `/reports/inventory-summary/`
* **GET** `/reports/finance-summary/`

---

## Notes / Conventions

1. **Business Filtering:** All endpoints automatically filter by `business_id` from token.
2. **Roles:**

   * OWNER: full access
   * MANAGER: can CRUD products, inventory, sales
   * STAFF: read-only access to allowed resources
3. **Pagination:** Standard DRF pagination (`page`, `page_size`)
4. **Search / Filters:** Use query params (`?search=...&price_min=...`)
5. **Error Handling:** Standard DRF responses:

```json
{
  "detail": "Not found."
}
```

---

## Headers Example

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

```
# Folder structure reference

- /accounts/
- /businesses/
- /products/
- /inventory/
- /sales/
- /finance/
- /reports/
```

---

# Summary

* All endpoints are **consistent, multi-tenant aware**
* JWT-based auth, role-aware permissions
* Frontend can safely assume `/resource/<model>/` pattern
* Search, pagination, filtering standardized
* CRUD patterns identical for all apps