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
  const [isLoginOpen, setIsLoginOpen] = useState(false);
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
    }, 3500);
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
      // If student, filter by studentRoll if desired, or load all
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
    loadOrders();
    const interval = setInterval(() => {
      loadOrders();
    }, 6000); // Poll every 6 seconds for live updates
    return () => clearInterval(interval);
  }, [loadOrders]);

  // Cart operations
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
        showToast(`Cannot add more than available stock (${item.quantity})`, 'warning');
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

  // Preorder submission (Strictly offline payment)
  const placeOrder = async (cookingNotes = '') => {
    if (!user || user.role !== 'STUDENT') {
      showToast('Please login as Student to place a preorder', 'error');
      setIsLoginOpen(true);
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
      await loadItems(); // Refresh inventory stock
      setActiveTrackingOrderId(res.order.id);
      setIsOrdersModalOpen(true);
      showToast(`Pre-order placed! Token #${res.order.token}`, 'success');
      return res.order;
    } else {
      showToast('Failed to place order. Please try again.', 'error');
      return null;
    }
  };

  // Staff operations
  const addNewItem = async (itemData) => {
    const res = await api.createMenuItem(itemData);
    if (res.success) {
      await loadItems();
      showToast(`"${itemData.name}" added to menu!`, 'success');
      return true;
    }
    showToast('Failed to add item', 'error');
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

  // Staff updates order status & remaining time
  const handleUpdateOrderStatus = async (orderId, newStatus, remainingMinutes) => {
    const res = await api.updateOrderStatus(orderId, newStatus, remainingMinutes);
    if (res.success) {
      await loadOrders();
      showToast(`Order status updated to ${newStatus}`, 'success');
      return true;
    }
    showToast('Failed to update status', 'error');
    return false;
  };

  // Demo Helpers
  const loadDemoMenu = () => {
    const demoItems = api.seedSampleMenu();
    setItems(demoItems);
    showToast('Loaded sample canteen menu for preview!', 'info');
  };

  const clearCurrentMenu = () => {
    const cleared = api.clearMenuData();
    setItems(cleared);
    showToast('Menu cleared. Initial state is empty as requested.', 'info');
  };

  // User Auth
  const loginUser = (userData) => {
    setUser(userData);
    setIsLoginOpen(false);
    showToast(`Welcome, ${userData.name}! Logged in as ${userData.role}`, 'success');
  };

  const logoutUser = () => {
    setUser(null);
    clearCart();
    showToast('Logged out successfully', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loginUser,
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
        isLoginOpen,
        setIsLoginOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isVegOnly,
        setIsVegOnly,
        isBackendConnected,
        loadDemoMenu,
        clearCurrentMenu,
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
