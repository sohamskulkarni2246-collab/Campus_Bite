# 🚀 CampusBite - Backend Developer & AI Implementation Guide

This guide is prepared specifically for **backend developers** (and AI coding assistants like Claude, ChatGPT, Gemini, Copilot) to implement or extend the backend server and database for the **CampusBite College Canteen Pre-order System**.

---

## 📌 Architecture Overview & Principles

1. **Role-First Onboarding**:
   - When a user opens the application, they are greeted by the **Role Portal** asking whether they are a **Student** or **Canteen Staff / New Canteen**.
   - Both sides have distinct **Sign In** and **Sign Up** workflows.
   - Any new college canteen can register their outlet (`canteenName`, `counterLocation`, `managerName`, `staffId`, `password`).
2. **Zero Hardcoded Food Items Initially**:
   - In accordance with specifications, initial call to `GET /api/items` returns an empty list `[]` until staff publishes items.
3. **Offline Payment Model**:
   - There is **no online payment gateway**. Pre-orders are stored with `paymentMethod: "OFFLINE_COUNTER"` and `paymentStatus: "UNPAID_PENDING_PICKUP"`.
   - Students pay at the counter upon food collection.
4. **Live Status & Time Remaining**:
   - Canteen staff updates order status (`RECEIVED`, `PREPARING`, `READY`, `COMPLETED`) and updates `remainingTimeMinutes` so students see real-time countdown.

---

## 🗄️ Database Schemas

### 1. Student Model
```json
{
  "id": "student_1728739000_abc",
  "name": "Rahul Sharma",
  "rollNo": "CS-2024-42",
  "email": "rahul@college.edu",
  "phone": "9876543210",
  "department": "B.Tech CSE 3rd Year",
  "password": "hashed_password",
  "createdAt": "2026-10-12T13:00:00.000Z"
}
```

### 2. Canteen Staff Model (Canteen Outlet Registration)
```json
{
  "id": "staff_1728739050_xyz",
  "canteenName": "Central Mess Food Court",
  "counterLocation": "Block B - Counter #1",
  "managerName": "Suresh Patil",
  "staffId": "central_staff",
  "email": "canteen@campus.edu",
  "phone": "9812345678",
  "password": "hashed_password",
  "createdAt": "2026-10-12T13:00:00.000Z"
}
```

### 3. Food Item Model
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

### 4. Order Model
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
  "notes": "Extra mint chutney",
  "createdAt": "2026-10-12T13:05:00.000Z",
  "updatedAt": "2026-10-12T13:07:00.000Z"
}
```

---

## 📡 REST API Endpoints Specification

Base URL: `http://localhost:5000/api`

### 1. Authentication Endpoints

#### `POST /api/auth/student/signup`
- **Request Body**:
```json
{
  "name": "Rahul Sharma",
  "rollNo": "CS-2024-42",
  "email": "rahul@college.edu",
  "phone": "9876543210",
  "department": "B.Tech CSE",
  "password": "studentSecretPassword"
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "user": {
    "role": "STUDENT",
    "id": "student_123",
    "name": "Rahul Sharma",
    "rollNo": "CS-2024-42",
    "email": "rahul@college.edu",
    "department": "B.Tech CSE"
  }
}
```

#### `POST /api/auth/student/signin`
- **Request Body**:
```json
{
  "identifier": "CS-2024-42",
  "password": "studentSecretPassword"
}
```
- **Response**: `200 OK` with user object (or `401 Unauthorized` on wrong password).

#### `POST /api/auth/staff/signup` (New Canteen Registration)
- **Request Body**:
```json
{
  "canteenName": "Block B Food Court",
  "counterLocation": "Block B - Counter #2",
  "managerName": "Chef Ramesh",
  "staffId": "canteen_block_b",
  "email": "canteen@campus.edu",
  "phone": "9812345678",
  "password": "canteenManagerPass"
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "user": {
    "role": "STAFF",
    "id": "staff_456",
    "name": "Chef Ramesh",
    "staffId": "canteen_block_b",
    "canteenName": "Block B Food Court",
    "counterLocation": "Block B - Counter #2"
  }
}
```

#### `POST /api/auth/staff/signin`
- **Request Body**:
```json
{
  "identifier": "canteen_block_b",
  "password": "canteenManagerPass"
}
```
- **Response**: `200 OK` with user object (or `401 Unauthorized` on wrong password).

---

### 2. Menu Items Endpoints

#### `GET /api/items`
- **Description**: Fetch all food menu items.
- **Initial Response**: `[]` (empty array).

#### `POST /api/items`
- **Description**: Canteen Staff publishes an item.
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

#### `PATCH /api/items/:id`
- **Description**: Adjust quantity/stock or price.

#### `DELETE /api/items/:id`
- **Description**: Remove item from menu.

---

### 3. Orders Endpoints

#### `GET /api/orders`
- **Query Params**: `?studentRoll=CS-2024-42` (optional filter for student).

#### `POST /api/orders`
- **Description**: Student places a pre-order. Automatically decrements inventory stock.

#### `PATCH /api/orders/:id/status`
- **Description**: Staff updates order status (`RECEIVED`, `PREPARING`, `READY`, `COMPLETED`) and `remainingTimeMinutes`.

---

## ⚡ Built-in Running Backend Server

A ready-to-run backend server is included in [`server.js`](./server.js).
To start it:

```bash
npm run server
```

The server listens on `http://localhost:5000` and automatically saves student accounts, canteen registrations, items, and orders to `backend_data.json`.
