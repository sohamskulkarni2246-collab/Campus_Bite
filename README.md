# 🍔 CampusBite - College Canteen Pre-Order System (Frontend)

A modern, fast, and responsive frontend for a college canteen pre-order system, designed with **Swiggy and Zomato** aesthetics.

---

## ✨ Features Breakdown

### 🎨 1. Swiggy & Zomato Inspired Design
- **Signature Food Cards**: High-resolution dish photos, Veg/Non-Veg indicators (green square / red triangle), prep time tags (`⚡ 10m prep`), bold pricing in ₹, and stock counts.
- **Micro-interactions**: Signature Swiggy floating **`+ ADD`** button that switches directly into a **`[-] 2 [+]`** quantity counter when in cart.
- **Sticky Floating Cart Bar**: Bottom pill indicating `X Items | ₹Total • VIEW CART ➔`.
- **Appetizing Color Palette**: Swiggy Orange (`#FC8019`), Zomato Red (`#E23744`), clean cards with soft shadows, and Google Fonts (`Plus Jakarta Sans` & `Inter`).

### 🍽️ 2. Dynamic Backend-Driven Menu (Initial State)
- **Zero Hardcoded Items**: Initially, no food item cards appear until loaded through the backend REST API (`GET /api/items`).
- **Graceful Empty State**: If the backend has not published items yet, an informative banner instructs staff to add items, while providing an optional "Load Sample Menu (Demo)" button for rapid UI previewing.

### 🔐 3. Dual Role Authentication (Login)
- **Student Login**:
  - Full Name, Student Roll Number / ID (e.g. `CS-2024-42`), Department.
  - "⚡ Autofill Demo Student" button for 1-click testing.
- **Canteen Staff Login**:
  - Staff Username / ID, Security PIN (Demo PIN: `1234`).
  - "⚡ Autofill Demo Staff" button.
- Instant role switcher pill in the header.

### 👨‍🍳 4. Canteen Staff Operations Portal
- **Add Food Item**:
  - Photo of item: Device file upload (with live preview) OR image URL OR 8 quick photo presets (Samosa, Burger, Thali, Dosa, Coffee, etc.).
  - Item Name.
  - Available Quantity / Stock.
  - Price in ₹.
  - Category (Snacks, Meals, South Indian, Fast Food, Beverages, Desserts).
  - Dietary Type (Veg / Non-Veg).
  - Prep Time estimate.
- **Live Order & Status Manager**:
  - View real-time student pre-orders with Token Number `#CB-XXX`, student roll, itemized details, and offline amount to collect.
  - Status actions:
    - `🟡 Received`
    - `🟠 Mark Preparing` (with interactive **Remaining Time adjuster** `-5m`, `+5m` so students know exact time left!)
    - `🟢 Mark Ready for Pickup`
    - `✔️ Done (Collected & Paid)`
- **Menu Inventory Control**:
  - Adjust stock on the fly (+1, -1, +5, -5).
  - Delete items or clear menu.

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
  - Live preparation time countdown badge (e.g. `⏳ ~8 mins remaining`).

---

## 🛠️ Tech Stack & Setup

- **Framework**: React 19 + Vite 8
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans & Inter
- **Styling**: Clean CSS system with CSS custom properties (Swiggy/Zomato design language)

### Running the Project:

```bash
# 1. Navigate to the project directory
cd Campus_bite_frontend

# 2. Install dependencies
npm install

# 3. Start Vite development server
npm run dev
```

Visit the displayed local URL (typically `http://localhost:5173/`).

---

## 🔌 Connecting to Backend API

1. Copy `.env.example` to `.env`:
   ```bash
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
2. See the file [`BACKEND_API_GUIDE.md`](./BACKEND_API_GUIDE.md) for:
   - Full REST endpoints specification.
   - Database schema shapes.
   - Ready-to-copy Node/Express and Python/FastAPI starter code.
3. *Note*: If the backend server is not running yet, the frontend automatically falls back to local storage mode, ensuring you can test the entire workflow (Student Pre-ordering & Staff Kitchen Management) without crashing!
