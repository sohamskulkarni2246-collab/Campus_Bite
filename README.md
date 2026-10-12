# 🍔 CampusBite - College Canteen Pre-Order System

A production-grade, fast, and responsive college canteen pre-order system designed with **Swiggy and Zomato** aesthetics.

---

## ✨ Features Breakdown

### 🚪 1. Role-First Entry Portal (Student vs Staff / New Canteen)
- When opening the application, users are immediately presented with a role selection screen:
  - **🎓 College Student**: Browse menu, place pre-orders, monitor live kitchen prep time.
  - **👨‍🍳 Canteen Staff / Outlet**: Manage menu items, accept student orders, update status, track stock.
- **Student Authentication**:
  - **Sign In**: Student Roll Number / ID (or Email) + Password.
  - **Sign Up**: Full Name, Student Roll Number / ID, College Email, Phone, Department/Year, Password.
- **Canteen Staff Authentication**:
  - **Sign In**: Staff ID / Username (or Email) + Password.
  - **Sign Up (New Canteen Outlet Registration)**: Canteen Name, Counter Location / Room, Manager Name, Staff ID, Email, Phone, Password.
- **100% Real Verification**: No demo credentials, no preset shortcuts. All accounts are validated against the backend.

### 🎨 2. Swiggy & Zomato Inspired Aesthetics
- **Food Cards**: Veg/Non-Veg indicators (green square / red triangle), high-resolution images, preparation time tags (`⚡ 10m prep`), bold pricing in ₹, and real-time stock counters.
- **Interactive Add Counter**: Floating `+ ADD` button that transforms into a `[-] 2 [+]` counter when added to cart.
- **Floating Bottom Cart Pill**: Sticky pill indicating `X Items | ₹Total • VIEW CART ➔`.
- **Appetizing Styling**: Swiggy Orange (`#FC8019`), Zomato Red (`#E23744`), clean cards with soft elevation shadows, and Google Fonts (`Plus Jakarta Sans` & `Inter`).

### 🍽️ 3. Backend-Driven Menu (Zero Hardcoded Items Initially)
- By default, initial menu is **completely empty** (`[]`) and is populated dynamically via `GET /api/items`.
- When empty, a clean notice instructs staff to publish today's items.

### 👨‍🍳 4. Canteen Staff Operations Portal
- **Add Food Item**:
  - Photo upload from device (with instant preview) OR image URL OR 8 quick food presets (Samosa, Burger, Thali, Dosa, Coffee, etc.).
  - Item Name, Available Quantity / Stock, Price in ₹, Category, Dietary preference (Veg/Non-Veg), and Prep Time estimate.
- **Live Order & Status Manager**:
  - View real-time student pre-orders with Token Number `#CB-XXX`, student roll, itemized details, and offline amount to collect.
  - Status actions:
    - `🟡 Received`
    - `🟠 Mark Preparing` (with interactive **Remaining Time adjuster** `-5m`, `+5m` so students know exact time left!)
    - `🟢 Mark Ready for Pickup`
    - `✔️ Done (Collected & Paid)`
- **Menu Inventory Control**: Adjust stock (+1, -1, +5, -5) and delete items.

### 🎓 5. Student Pre-Order & Cart Section
- **Menu Browsing**: Search bar, category pill filter, Pure Veg filter switch.
- **Quantity Control**: Add, increase, decrease, or remove quantities both directly from the menu card and inside the cart drawer.
- **Cart Drawer**:
  - Item breakdown with thumbnails and prices.
  - Special cooking instructions note (e.g. *"Extra chutney, less spicy"*).
  - Bill summary: Items Total, Canteen Handling (FREE), Total Payable.
- **💵 STRICTLY OFFLINE PAYMENT ONLY**:
  - **No online payment gateway** (No Razorpay/Stripe).
  - Highlighted card informing students to pay via Cash or Counter QR Code at the canteen desk upon pickup.
- **Live Pre-order Tracker**:
  - Token Number (e.g. `#CB-482`) to present at the counter.
  - 4-Stage visual status stepper (*Received ➔ Preparing ➔ Ready ➔ Completed*).
  - Live preparation time countdown badge (e.g. `⏳ ~8 mins remaining`) updated by staff in real time.

---

## 🛠️ How to Run the Project

### 1. Start the Backend Server:
```powershell
cd C:\Users\admin\.gemini\antigravity\scratch\Campus_bite_frontend
npm run server
```
The backend will start at `http://localhost:5000` and automatically persist student accounts, canteen registrations, items, and orders to `backend_data.json`.

### 2. Start the Frontend:
In a new terminal window:
```powershell
cd C:\Users\admin\.gemini\antigravity\scratch\Campus_bite_frontend
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 🔌 API & Integration

See [`BACKEND_API_GUIDE.md`](./BACKEND_API_GUIDE.md) for full REST schemas, endpoints, and database models.
