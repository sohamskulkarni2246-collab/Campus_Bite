import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Current logged in user: role: 'STUDENT' | 'STAFF' | null
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campus_bite_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Food Menu Items (Initially starts EMPTY as requested, loaded via backend/API)
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  // Cart: [{ id, name, price, quantity, imageUrl, isVeg }]
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('campus_bite_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Backend connection status
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // UI Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(null);

  // Filter state for Student menu
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVegOnly, setIsVegOnly] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Sync user & cart with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('campus_bite_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campus_bite_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('campus_bite_cart', JSON.stringify(cart));
  }, [cart]);

  // Load items from API / storage
  const loadItems = useCallback(async () => {
    setItemsLoading(true);
    try {
      const res = await api.fetchMenuItems();
      setItems(res.data || []);
      setIsBackendConnected(res.isBackend);
    } catch (err) {
      console.error('Failed to load menu items:', err);
    } finally {
      setItemsLoading(false);
    }
  }, []);

  // Load orders
  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const studentRoll = user?.role === 'STUDENT' ? user.rollNo : null;
      const res = await api.fetchOrders(studentRoll);
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  // Initial load & periodic poll for live order updates
  useEffect(() => {
    loadItems();
    api.checkBackendConnection().then(setIsBackendConnected);
  }, [loadItems]);

  useEffect(() => {
    if (user) {
      loadOrders();
      const interval = setInterval(() => {
        loadOrders();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user, loadOrders]);

  // -------------------------------------------------------------
  // REAL AUTHENTICATION METHODS (STUDENT & STAFF / CANTEEN)
  // -------------------------------------------------------------

  const registerStudent = async (formData) => {
    const res = await api.studentSignUp(formData);
    if (res.success) {
      setUser(res.user);
      showToast(`Welcome, ${res.user.name}! Account registered successfully.`, 'success');
      return { success: true };
    }
    showToast(res.error || 'Student registration failed', 'error');
    return { success: false, error: res.error };
  };

  const loginStudent = async (identifier, password) => {
    const res = await api.studentSignIn(identifier, password);
    if (res.success) {
      setUser(res.user);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      return { success: true };
    }
    showToast(res.error || 'Student sign in failed', 'error');
    return { success: false, error: res.error };
  };

  const registerStaff = async (formData) => {
    const res = await api.staffSignUp(formData);
    if (res.success) {
      setUser(res.user);
      showToast(`Canteen "${res.user.canteenName}" registered! Welcome, ${res.user.name}.`, 'success');
      return { success: true };
    }
    showToast(res.error || 'Canteen registration failed', 'error');
    return { success: false, error: res.error };
  };

  const loginStaff = async (identifier, password) => {
    const res = await api.staffSignIn(identifier, password);
    if (res.success) {
      setUser(res.user);
      showToast(`Welcome, ${res.user.name} (${res.user.canteenName})!`, 'success');
      return { success: true };
    }
    showToast(res.error || 'Staff sign in failed', 'error');
    return { success: false, error: res.error };
  };

  const logoutUser = () => {
    setUser(null);
    clearCart();
    showToast('Signed out successfully', 'info');
  };

  // -------------------------------------------------------------
  // CART OPERATIONS
  // -------------------------------------------------------------
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        if (existing.quantity >= item.quantity) {
          showToast(`Only ${item.quantity} available in stock!`, 'warning');
          return prev;
        }
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast(`Added ${item.name} to cart!`, 'success');
  };

  const updateCartQuantity = (itemId, newQty) => {
    setCart((prev) => {
      if (newQty <= 0) {
        return prev.filter((i) => i.id !== itemId);
      }
      const item = items.find((it) => it.id === itemId);
      if (item && newQty > item.quantity) {
        showToast(`Cannot exceed available canteen stock (${item.quantity})`, 'warning');
        return prev;
      }
      return prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i));
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // -------------------------------------------------------------
  // PREORDER SUBMISSION (Strictly Offline Payment)
  // -------------------------------------------------------------
  const placeOrder = async (cookingNotes = '') => {
    if (!user || user.role !== 'STUDENT') {
      showToast('Please sign in as a student to place an order', 'error');
      return null;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty', 'warning');
      return null;
    }

    const maxPrepTime = Math.max(
      10,
      ...cart.map((c) => Number(c.prepTime) || 10)
    );

    const orderPayload = {
      studentName: user.name,
      studentRoll: user.rollNo,
      studentPhone: user.phone || 'N/A',
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        isVeg: item.isVeg,
      })),
      totalAmount: cartTotal,
      estimatedPrepTime: maxPrepTime,
      notes: cookingNotes,
    };

    const res = await api.submitOrder(orderPayload);
    if (res.success) {
      clearCart();
      setIsCartOpen(false);
      await loadOrders();
      await loadItems();
      setActiveTrackingOrderId(res.order.id);
      setIsOrdersModalOpen(true);
      showToast(`Pre-order submitted! Token #${res.order.token}`, 'success');
      return res.order;
    } else {
      showToast('Failed to place pre-order. Please try again.', 'error');
      return null;
    }
  };

  // -------------------------------------------------------------
  // STAFF OPERATIONS
  // -------------------------------------------------------------
  const addNewItem = async (itemData) => {
    const res = await api.createMenuItem(itemData);
    if (res.success) {
      await loadItems();
      showToast(`"${itemData.name}" added to menu!`, 'success');
      return true;
    }
    showToast('Failed to add item to menu', 'error');
    return false;
  };

  const updateItemDetails = async (id, updates) => {
    const res = await api.updateMenuItem(id, updates);
    if (res.success) {
      await loadItems();
      showToast('Menu item updated', 'success');
      return true;
    }
    return false;
  };

  const deleteItem = async (id) => {
    const res = await api.deleteMenuItem(id);
    if (res.success) {
      await loadItems();
      showToast('Item removed from menu', 'info');
      return true;
    }
    return false;
  };

  const handleUpdateOrderStatus = async (orderId, newStatus, remainingMinutes) => {
    const res = await api.updateOrderStatus(orderId, newStatus, remainingMinutes);
    if (res.success) {
      await loadOrders();
      showToast(`Order status updated to ${newStatus}`, 'success');
      return true;
    }
    showToast('Failed to update order status', 'error');
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        registerStudent,
        loginStudent,
        registerStaff,
        loginStaff,
        logoutUser,
        items,
        itemsLoading,
        loadItems,
        addNewItem,
        updateItemDetails,
        deleteItem,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        orders,
        ordersLoading,
        loadOrders,
        placeOrder,
        handleUpdateOrderStatus,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        isOrdersModalOpen,
        setIsOrdersModalOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isVegOnly,
        setIsVegOnly,
        isBackendConnected,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
