/**
 * CampusBite API Client Service
 * 
 * Configured to connect to your backend REST API.
 * By default, endpoints target: http://localhost:5000/api (or VITE_API_BASE_URL).
 * If the backend server is not currently reachable, it seamlessly uses
 * browser localStorage so the frontend is 100% testable immediately.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Keys for fallback local persistence
const STORAGE_KEYS = {
  ITEMS: 'campus_bite_items',
  ORDERS: 'campus_bite_orders',
};

// Check if backend API is reachable
export async function checkBackendConnection() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/health`, { credentials: 'omit', credentials: 'omit', signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// MENU ITEMS API
// -------------------------------------------------------------

/**
 * Fetch all food items from the backend
 * Requirements: Initially returns an empty list [] until items are added
 */
export async function fetchMenuItems() {
  try {
    const res = await fetch(`${API_BASE_URL}/items`);
    if (res.ok) {
      const data = await res.json();
      return { data: Array.isArray(data) ? data : data.items || [], isBackend: true };
    }
  } catch (err) {
    console.info('Backend API unavailable, using local cache:', err.message);
  }

  // Fallback to local storage (initially empty array as requested!)
  const localItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
  return { data: localItems, isBackend: false };
}

/**
 * Staff adds a new food item
 * @param {Object} item - { name, price, quantity, category, isVeg, imageUrl, prepTime, description }
 */
export async function createMenuItem(item) {
  const payload = {
    ...item,
    price: Number(item.price),
    quantity: Number(item.quantity),
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const created = await res.json();
      return { success: true, item: created, isBackend: true };
    }
  } catch (err) {
    console.info('Backend unreachable, saving item to local storage:', err.message);
  }

  // Local fallback
  const localItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
  const newItem = {
    ...payload,
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  };
  localItems.unshift(newItem);
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(localItems));
  return { success: true, item: newItem, isBackend: false };
}

/**
 * Staff updates stock or item details
 */
export async function updateMenuItem(id, updates) {
  try {
    const res = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      return { success: true, item: updated, isBackend: true };
    }
  } catch (err) {
    console.info('Backend unreachable, updating item in local storage:', err.message);
  }

  const localItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
  const index = localItems.findIndex((it) => it.id === id);
  if (index !== -1) {
    localItems[index] = { ...localItems[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(localItems));
    return { success: true, item: localItems[index], isBackend: false };
  }
  return { success: false, error: 'Item not found' };
}

/**
 * Staff deletes an item
 */
export async function deleteMenuItem(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) return { success: true, isBackend: true };
  } catch (err) {
    console.info('Backend unreachable, deleting locally:', err.message);
  }

  const localItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
  const filtered = localItems.filter((it) => it.id !== id);
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(filtered));
  return { success: true, isBackend: false };
}

// -------------------------------------------------------------
// ORDERS API
// -------------------------------------------------------------

/**
 * Fetch all orders (Staff views all, Student can filter by studentRoll)
 */
export async function fetchOrders(studentRoll = null) {
  try {
    const url = studentRoll
      ? `${API_BASE_URL}/orders?studentRoll=${encodeURIComponent(studentRoll)}`
      : `${API_BASE_URL}/orders`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return { data: Array.isArray(data) ? data : data.orders || [], isBackend: true };
    }
  } catch (err) {
    console.info('Backend unreachable, fetching orders from local storage:', err.message);
  }

  const localOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  const filtered = studentRoll
    ? localOrders.filter((o) => o.studentRoll === studentRoll)
    : localOrders;
  return { data: filtered, isBackend: false };
}

/**
 * Student places a preorder
 * Notice: paymentMethod is strictly 'OFFLINE_CASH' / Pay at counter!
 */
export async function submitOrder(orderData) {
  const tokenNumber = Math.floor(100 + Math.random() * 900); // e.g. #CB-384
  const payload = {
    ...orderData,
    token: `CB-${tokenNumber}`,
    status: 'RECEIVED', // 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'
    remainingTimeMinutes: orderData.estimatedPrepTime || 15,
    paymentMethod: 'OFFLINE_COUNTER', // Strictly Offline Payment
    paymentStatus: 'UNPAID_PENDING_PICKUP',
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const created = await res.json();
      return { success: true, order: created, isBackend: true };
    }
  } catch (err) {
    console.info('Backend unreachable, placing order in local storage:', err.message);
  }

  // Local fallback
  const localOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  const newOrder = {
    ...payload,
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  };
  localOrders.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(localOrders));

  // Also decrement stock in local storage
  const localItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
  orderData.items.forEach((ordered) => {
    const item = localItems.find((it) => it.id === ordered.id);
    if (item) {
      item.quantity = Math.max(0, item.quantity - ordered.quantity);
    }
  });
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(localItems));

  return { success: true, order: newOrder, isBackend: false };
}

/**
 * Staff updates order status & remaining preparation time
 * @param {string} orderId 
 * @param {string} status - 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED'
 * @param {number} remainingMinutes - estimated time remaining in minutes (e.g. 10, 5, 0)
 */
export async function updateOrderStatus(orderId, status, remainingMinutes) {
  const updates = {
    status,
    remainingTimeMinutes: remainingMinutes !== undefined ? Number(remainingMinutes) : undefined,
    updatedAt: new Date().toISOString(),
  };

  if (status === 'COMPLETED') {
    updates.paymentStatus = 'PAID_COLLECTED';
    updates.remainingTimeMinutes = 0;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      return { success: true, order: updated, isBackend: true };
    }
  } catch (err) {
    console.info('Backend unreachable, updating order in local storage:', err.message);
  }

  const localOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  const idx = localOrders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    localOrders[idx] = { ...localOrders[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(localOrders));
    return { success: true, order: localOrders[idx], isBackend: false };
  }
  return { success: false, error: 'Order not found' };
}

/**
 * Optional helper to seed demo items (used if user clicks "Load Demo Menu" for quick UI preview)
 */
export function seedSampleMenu() {
  const sampleItems = [
    {
      id: 'demo_1',
      name: 'Crispy Aloo Samosa (2 Pcs)',
      price: 30,
      quantity: 25,
      category: 'Snacks',
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      prepTime: 5,
      description: 'Hot and flaky pastry stuffed with spiced potato filling, served with mint and tamarind chutney.',
    },
    {
      id: 'demo_2',
      name: 'Paneer Butter Masala Thali',
      price: 120,
      quantity: 15,
      category: 'Meals',
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
      prepTime: 12,
      description: 'Rich paneer gravy served with 3 butter rotis, steamed jeera rice, dal tadka, and fresh salad.',
    },
    {
      id: 'demo_3',
      name: 'Cheese Grilled Veg Burger',
      price: 75,
      quantity: 20,
      category: 'Fast Food',
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      prepTime: 10,
      description: 'Crispy veggie patty layered with melted cheddar cheese slice, fresh lettuce, and tangy burger mayo.',
    },
    {
      id: 'demo_4',
      name: 'Masala Dosa with Chutney & Sambar',
      price: 60,
      quantity: 18,
      category: 'South Indian',
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
      prepTime: 8,
      description: 'Golden crispy fermented crepe filled with spiced mashed potato, served with coconut chutney & hot sambar.',
    },
    {
      id: 'demo_5',
      name: 'Chilli Chicken Fried Rice',
      price: 130,
      quantity: 12,
      category: 'Fast Food',
      isVeg: false,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
      prepTime: 15,
      description: 'Wok-tossed basmati rice with diced chicken, bell peppers, spring onions, and spicy Indo-Chinese sauces.',
    },
    {
      id: 'demo_6',
      name: 'Chilled Cold Coffee with Ice Cream',
      price: 50,
      quantity: 30,
      category: 'Beverages',
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
      prepTime: 4,
      description: 'Thick blended coffee topped with chocolate drizzle and a scoop of vanilla ice cream.',
    },
  ];
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(sampleItems));
  return sampleItems;
}

export function clearMenuData() {
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify([]));
  return [];
}
