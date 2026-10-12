# 🚀 CampusBite - Backend Developer & AI Implementation Guide

This guide is prepared specifically for **backend developers** (and AI coding assistants like Claude, ChatGPT, Gemini, Copilot) to implement the server and database for the **CampusBite College Canteen Pre-order System**.

---

## 📌 Architecture Overview & Principles

1. **Dynamic Menu Cards (Initial State)**:
   - In accordance with specifications, the frontend does **not** hardcode any menu food item cards.
   - Initial call to `GET /api/items` should return an empty array `[]` until staff adds items or the database is seeded.
2. **Offline Payment Model**:
   - There is **no online payment gateway** (No Razorpay / Stripe / PayTM).
   - Pre-orders are placed with `paymentMethod: "OFFLINE_COUNTER"` and `paymentStatus: "UNPAID_PENDING_PICKUP"`.
   - Students pay at the canteen desk via Cash or Counter QR when collecting their food.
   - When staff marks the order as `COMPLETED`, `paymentStatus` switches to `"PAID_COLLECTED"`.
3. **Live Order Status & Prep Time Tracking**:
   - Staff can set status (`RECEIVED`, `PREPARING`, `READY`, `COMPLETED`) and `remainingTimeMinutes` (e.g. 15, 10, 5, 0).
   - Students poll/fetch updates to see real-time countdown.

---

## 🗄️ Database Schemas

### 1. Item Model (Food Menu)
```json
{
  "id": "item_1728739100_abc",
  "name": "Crispy Paneer Samosa (2 Pcs)",
  "price": 40,
  "quantity": 25,
  "category": "Snacks",
  "isVeg": true,
  "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600",
  "prepTime": 10,
  "description": "Served hot with homemade mint & tamarind chutney.",
  "createdAt": "2026-10-12T13:00:00.000Z"
}
```

### 2. Order Model (Pre-orders)
```json
{
  "id": "order_1728739200_xyz",
  "token": "CB-384",
  "studentName": "Rahul Sharma",
  "studentRoll": "CS-2024-42",
  "studentPhone": "9876543210",
  "items": [
    {
      "id": "item_1728739100_abc",
      "name": "Crispy Paneer Samosa (2 Pcs)",
      "price": 40,
      "quantity": 2,
      "isVeg": true
    }
  ],
  "totalAmount": 80,
  "status": "PREPARING",
  "remainingTimeMinutes": 10,
  "paymentMethod": "OFFLINE_COUNTER",
  "paymentStatus": "UNPAID_PENDING_PICKUP",
  "notes": "Extra spicy please",
  "createdAt": "2026-10-12T13:05:00.000Z",
  "updatedAt": "2026-10-12T13:07:00.000Z"
}
```

---

## 📡 REST API Endpoints Specification

Base URL: `http://localhost:5000/api`

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `200 OK`
```json
{ "status": "ok", "timestamp": "2026-10-12T13:00:00.000Z" }
```

---

### 2. Menu Items Endpoints

#### `GET /api/items`
- **Description**: Fetch all food menu items.
- **Initial Response (when empty)**: `200 OK` with `[]`
- **Response (with items)**: `200 OK` with array of Item objects.

#### `POST /api/items`
- **Description**: Staff adds a new item to the menu.
- **Request Body**:
```json
{
  "name": "Cheese Grilled Veg Burger",
  "price": 75,
  "quantity": 20,
  "category": "Fast Food",
  "isVeg": true,
  "prepTime": 10,
  "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
  "description": "Crispy veggie patty with cheddar slice."
}
```
- **Response**: `201 Created` with created Item object (including generated `id`).

#### `PATCH /api/items/:id`
- **Description**: Update item stock, price, or details.
- **Request Body**:
```json
{
  "quantity": 15
}
```
- **Response**: `200 OK` with updated Item object.

#### `DELETE /api/items/:id`
- **Description**: Staff deletes an item from the menu.
- **Response**: `200 OK`
```json
{ "success": true, "message": "Item deleted" }
```

---

### 3. Orders Endpoints

#### `GET /api/orders`
- **Description**: Fetch pre-orders. Supports optional query parameter:
  - `?studentRoll=CS-2024-42` (filter student's own orders)
  - Without query: returns all orders (for Canteen Staff)
- **Response**: `200 OK` with array of Order objects.

#### `POST /api/orders`
- **Description**: Student places a pre-order.
- **Note**: The backend should decrement inventory stock for ordered items.
- **Request Body**:
```json
{
  "studentName": "Rahul Sharma",
  "studentRoll": "CS-2024-42",
  "studentPhone": "N/A",
  "items": [
    {
      "id": "item_123",
      "name": "Samosa",
      "price": 30,
      "quantity": 2,
      "isVeg": true
    }
  ],
  "totalAmount": 60,
  "estimatedPrepTime": 10,
  "notes": "Extra mint chutney"
}
```
- **Response**: `201 Created` with created Order object including generated token `CB-XXX`.

#### `PATCH /api/orders/:id/status`
- **Description**: Staff updates order status and remaining prep time.
- **Request Body**:
```json
{
  "status": "PREPARING",
  "remainingTimeMinutes": 8
}
```
- **Possible `status` values**:
  - `"RECEIVED"`: Order received by canteen desk
  - `"PREPARING"`: Being cooked in the kitchen (display remaining time)
  - `"READY"`: Ready for pickup at counter (`remainingTimeMinutes = 0`)
  - `"COMPLETED"`: Student picked up food and paid at counter (`paymentStatus = "PAID_COLLECTED"`)
- **Response**: `200 OK` with updated Order object.

---

## ⚡ Instant Starter: Express.js (Node.js) Backend

You can give this exact file to an AI or backend developer to run immediately:

```javascript
// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory or database collections
let items = []; // Initially EMPTY as per requirement!
let orders = [];

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Items
app.get('/api/items', (req, res) => res.json(items));

app.post('/api/items', (req, res) => {
  const newItem = {
    ...req.body,
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  res.status(201).json(newItem);
});

app.patch('/api/items/:id', (req, res) => {
  const idx = items.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  items[idx] = { ...items[idx], ...req.body };
  res.json(items[idx]);
});

app.delete('/api/items/:id', (req, res) => {
  items = items.filter((i) => i.id !== req.params.id);
  res.json({ success: true });
});

// Orders
app.get('/api/orders', (req, res) => {
  const { studentRoll } = req.query;
  if (studentRoll) {
    return res.json(orders.filter((o) => o.studentRoll === studentRoll));
  }
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const token = `CB-${Math.floor(100 + Math.random() * 900)}`;
  const newOrder = {
    ...req.body,
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    token,
    status: 'RECEIVED',
    remainingTimeMinutes: req.body.estimatedPrepTime || 15,
    paymentMethod: 'OFFLINE_COUNTER',
    paymentStatus: 'UNPAID_PENDING_PICKUP',
    createdAt: new Date().toISOString(),
  };
  
  // Decrement stock
  newOrder.items.forEach((ordered) => {
    const item = items.find((i) => i.id === ordered.id);
    if (item) item.quantity = Math.max(0, item.quantity - ordered.quantity);
  });

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const idx = orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  
  const { status, remainingTimeMinutes } = req.body;
  if (status) orders[idx].status = status;
  if (remainingTimeMinutes !== undefined) orders[idx].remainingTimeMinutes = remainingTimeMinutes;
  if (status === 'COMPLETED') {
    orders[idx].paymentStatus = 'PAID_COLLECTED';
    orders[idx].remainingTimeMinutes = 0;
  }
  orders[idx].updatedAt = new Date().toISOString();
  
  res.json(orders[idx]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CampusBite Backend listening on port ${PORT}`));
```
