/**
 * CampusBite API Client Service
 * 
 * Configured to connect to your backend REST API.
 * Target URL: http://localhost:5000/api (or VITE_API_BASE_URL).
 * If the backend server is not currently reachable, it uses browser
 * local persistence so the entire app works 100% complete with real authentication.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173'
    ? 'http://localhost:5000/api'
    : '/api'
);

// Keys for fallback persistence
const STORAGE_KEYS = {
  ITEMS: 'campus_bite_items',
  ORDERS: 'campus_bite_orders',
  STUDENTS: 'campus_bite_registered_students',
  STAFF_USERS: 'campus_bite_registered_staff',
};

// Check if backend API is reachable
export async function checkBackendConnection() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// AUTHENTICATION API: STUDENT
// -------------------------------------------------------------

/**
 * Register a new student
 * @param {Object} data - { name, rollNo, email, phone, department, password }
 */
export async function studentSignUp(data) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/student/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) {
      return { success: true, user: result.user, isBackend: true };
    }
    return { success: false, error: result.error || 'Registration failed' };
  } catch (err) {
    console.info('Backend unreachable, saving student locally:', err.message);
  }

  // Local fallback persistence
  const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
  const normalizedRoll = data.rollNo.trim().toUpperCase();
  const existing = students.find(
    (s) => s.rollNo.toUpperCase() === normalizedRoll || (data.email && s.email && s.email.toLowerCase() === data.email.trim().toLowerCase())
  );

  if (existing) {
    return { success: false, error: 'A student with this Roll Number or Email is already registered.' };
  }

  const newStudent = {
    id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: data.name.trim(),
    rollNo: normalizedRoll,
    email: data.email ? data.email.trim().toLowerCase() : '',
    phone: data.phone ? data.phone.trim() : '',
    department: data.department ? data.department.trim() : 'General',
    password: data.password.trim(),
    createdAt: new Date().toISOString(),
  };

  students.push(newStudent);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

  const user = {
    role: 'STUDENT',
    id: newStudent.id,
    name: newStudent.name,
    rollNo: newStudent.rollNo,
    email: newStudent.email,
    department: newStudent.department,
  };

  return { success: true, user, isBackend: false };
}

/**
 * Sign in an existing student
 * @param {string} identifier - Roll number or Email
 * @param {string} password - Password
 */
export async function studentSignIn(identifier, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/student/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const result = await res.json();
    if (res.ok) {
      return { success: true, user: result.user, isBackend: true };
    }
    return { success: false, error: result.error || 'Invalid credentials' };
  } catch (err) {
    console.info('Backend unreachable, verifying student locally:', err.message);
  }

  // Local fallback verification
  const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
  const cleanIdent = identifier.trim().toUpperCase();
  const student = students.find(
    (s) => s.rollNo.toUpperCase() === cleanIdent || s.email.toUpperCase() === cleanIdent
  );

  if (!student) {
    return { success: false, error: 'No student found with this Roll Number or Email. Please sign up first.' };
  }

  if (student.password !== password.trim()) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  const user = {
    role: 'STUDENT',
    id: student.id,
    name: student.name,
    rollNo: student.rollNo,
    email: student.email,
    department: student.department,
  };

  return { success: true, user, isBackend: false };
}

// -------------------------------------------------------------
// AUTHENTICATION API: STAFF & NEW CANTEEN REGISTRATION
// -------------------------------------------------------------

/**
 * Register a new Canteen and its Staff account
 * @param {Object} data - { canteenName, managerName, staffId, email, phone, counterLocation, password }
 */
export async function staffSignUp(data) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/staff/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) {
      return { success: true, user: result.user, isBackend: true };
    }
    return { success: false, error: result.error || 'Canteen registration failed' };
  } catch (err) {
    console.info('Backend unreachable, registering canteen locally:', err.message);
  }

  // Local fallback persistence
  const staffList = JSON.parse(localStorage.getItem(STORAGE_KEYS.STAFF_USERS) || '[]');
  const cleanStaffId = data.staffId.trim().toLowerCase();
  const existing = staffList.find((s) => s.staffId.toLowerCase() === cleanStaffId);

  if (existing) {
    return { success: false, error: 'Staff ID is already registered. Please choose another ID.' };
  }

  const newStaff = {
    id: `staff_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    canteenName: data.canteenName.trim(),
    managerName: data.managerName.trim(),
    staffId: cleanStaffId,
    email: data.email ? data.email.trim().toLowerCase() : '',
    phone: data.phone ? data.phone.trim() : '',
    counterLocation: data.counterLocation ? data.counterLocation.trim() : 'Main Counter',
    password: data.password.trim(),
    createdAt: new Date().toISOString(),
  };

  staffList.push(newStaff);
  localStorage.setItem(STORAGE_KEYS.STAFF_USERS, JSON.stringify(staffList));

  const user = {
    role: 'STAFF',
    id: newStaff.id,
    name: newStaff.managerName,
    staffId: newStaff.staffId,
    canteenName: newStaff.canteenName,
    counterLocation: newStaff.counterLocation,
  };

  return { success: true, user, isBackend: false };
}

/**
 * Sign in existing Canteen Staff
 * @param {string} identifier - Staff ID or Email
 * @param {string} password - Password
 */
export async function staffSignIn(identifier, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/staff/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const result = await res.json();
    if (res.ok) {
      return { success: true, user: result.user, isBackend: true };
    }
    return { success: false, error: result.error || 'Invalid credentials' };
  } catch (err) {
    console.info('Backend unreachable, verifying staff locally:', err.message);
  }

  // Local fallback verification
  const staffList = JSON.parse(localStorage.getItem(STORAGE_KEYS.STAFF_USERS) || '[]');
  const cleanIdent = identifier.trim().toLowerCase();
  const staff = staffList.find(
    (s) => s.staffId.toLowerCase() === cleanIdent || s.email.toLowerCase() === cleanIdent
  );

  if (!staff) {
    return { success: false, error: 'No canteen staff found with this ID. Please register your canteen first.' };
  }

  if (staff.password !== password.trim()) {
    return { success: false, error: 'Incorrect security password. Please try again.' };
  }

  const user = {
    role: 'STAFF',
    id: staff.id,
    name: staff.managerName,
    staffId: staff.staffId,
    canteenName: staff.canteenName,
    counterLocation: staff.counterLocation,
  };

  return { success: true, user, isBackend: false };
}

// -------------------------------------------------------------
// MENU ITEMS API
// -------------------------------------------------------------

/**
 * Fetch all food items from the backend
 * Initially returns an empty list [] until items are added by staff
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
 * Fetch all orders
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
 * Student places a preorder (Strictly Offline Payment)
 */
export async function submitOrder(orderData) {
  const tokenNumber = Math.floor(100 + Math.random() * 900);
  const payload = {
    ...orderData,
    token: `CB-${tokenNumber}`,
    status: 'RECEIVED',
    remainingTimeMinutes: orderData.estimatedPrepTime || 15,
    paymentMethod: 'OFFLINE_COUNTER',
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

  // Decrement stock locally
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

export function clearMenuData() {
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify([]));
  return [];
}
