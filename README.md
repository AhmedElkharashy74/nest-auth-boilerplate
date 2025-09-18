# Tourism API — Endpoints Reference

This document lists all API endpoints with their request/response structures, aligned with the Prisma schema and business logic. No extra descriptions, just endpoints, requests, and responses.

---


## Categories

### GET /categories

**Response 200**

```json
[{ "id": 1, "title": "Tours", "slug": "tours" }]
```

### POST /admin/categories

**Request**

```json
{ "title": "Tours", "slug": "tours", "description": "All tours" }
```

**Response 201**

```json
{ "id": 1, "title": "Tours", "slug": "tours", "description": "All tours" }
```

---

## Items

### GET /items

**Response 200**

```json
[{ "id": 1, "title": "Hotel Stay", "basePrice": 120.5, "isActive": true }]
```

### GET /items/\:id

**Response 200**

```json
{ "id": 1, "title": "Hotel Stay", "description": "...", "attachments": [], "basePrice": 120.5 }
```

### POST /admin/items

**Request**

```json
{ "title": "Hotel Stay", "description": "...", "basePrice": 120.5, "attachments": [] }
```

**Response 201**

```json
{ "id": 1, "title": "Hotel Stay", "description": "...", "attachments": [], "basePrice": 120.5 }
```

---

## Packages

### GET /packages

**Response 200**

```json
[{ "id": 1, "title": "Cairo Explorer", "basePrice": 450.0, "durationDays": 5 }]
```

### GET /packages/\:id

**Response 200**

```json
{ "id": 1, "title": "Cairo Explorer", "basePrice": 450.0, "durationDays": 5, "items": [] }
```

### POST /admin/packages

**Request**

```json
{ "title": "Cairo Explorer", "slug": "cairo-explorer", "description": "...", "basePrice": 450.0, "durationDays": 5 }
```

**Response 201**

```json
{ "id": 1, "title": "Cairo Explorer", "slug": "cairo-explorer" }
```

### POST /admin/packages/\:id/items

**Request**

```json
[{ "itemId": 1, "quantity": 1, "note": "Day 1" }]
```

**Response 200**

```json
{ "id": 1, "title": "Cairo Explorer", "items": [{ "itemId": 1, "quantity": 1, "note": "Day 1" }] }
```

---

## Cart

### GET /cart

**Response 200**

```json
{ "id": 10, "guestToken": "uuid", "items": [] }
```

### POST /cart/items

**Request**

```json
{ "itemId": 1, "quantity": 2, "startDate": "2025-11-01", "endDate": "2025-11-05" }
```

**Response 200**

```json
{ "id": 10, "items": [{ "id": 100, "itemId": 1, "quantity": 2 }] }
```

### PATCH /cart/items/\:id

**Request**

```json
{ "quantity": 3 }
```

**Response 200**

```json
{ "id": 100, "itemId": 1, "quantity": 3 }
```

### DELETE /cart/items/\:id

**Response 204**

```json
{}
```

---

## Checkout & Orders

### POST /checkout

**Request**

```json
{ "cartId": 10 }
```

**Response 201**

```json
{ "orderId": 20, "paymentId": 5, "paymentUrl": "https://pay.example.com/session/abc" }
```

### GET /orders/\:id

**Response 200**

```json
{ "id": 20, "totalAmount": 300.0, "status": "PENDING", "items": [] }
```

### GET /admin/orders

**Response 200**

```json
[{ "id": 20, "totalAmount": 300.0, "status": "PENDING" }]
```

---

## Bookings

### GET /bookings

**Response 200**

```json
[{ "id": 30, "orderId": 20, "itemId": 1, "status": "PENDING" }]
```

### PATCH /bookings/\:id

**Request**

```json
{ "status": "CANCELLED" }
```

**Response 200**

```json
{ "id": 30, "status": "CANCELLED" }
```

---

## Payments

### POST /payments/\:orderId/initiate

**Response 201**

```json
{ "paymentId": 5, "provider": "stripe", "status": "INITIATED", "paymentUrl": "https://pay.example.com/session/abc" }
```

### GET /payments/\:id

**Response 200**

```json
{ "id": 5, "orderId": 20, "status": "SUCCEEDED" }
```

### POST /webhooks/payments

**Request** (from provider)

```json
{ "event": "payment_succeeded", "paymentId": 5 }
```

**Response 200**

```json
{ "success": true }
```
