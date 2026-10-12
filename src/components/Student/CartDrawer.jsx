import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Banknote, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    cart, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    isCartOpen, 
    setIsCartOpen, 
    placeOrder, 
    user, 
    logoutUser 
  } = useApp();

  const [cookingNotes, setCookingNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      logoutUser();
      return;
    }

    setIsSubmitting(true);
    try {
      await placeOrder(cookingNotes);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsCartOpen(false)}>
      <div 
        className="modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <h3>
            <ShoppingBag size={20} color="#fc8019" />
            <span>Canteen Pre-order Cart ({cart.length})</span>
          </h3>
          <button className="modal-close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Your cart is empty</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                Explore today's canteen menu and pre-order your favorite snacks & meals!
              </p>
              <button 
                className="nav-btn nav-btn-primary" 
                onClick={() => setIsCartOpen(false)}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    SELECTED ITEMS
                  </span>
                  <button 
                    onClick={clearCart} 
                    style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}
                  >
                    Clear All
                  </button>
                </div>

                {cart.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <div className="cart-item-info">
                      <img 
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'} 
                        alt={item.name} 
                        className="cart-item-thumb" 
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'}></span>
                          <span className="cart-item-title">{item.name}</span>
                        </div>
                        <span className="cart-item-unit-price">₹{item.price} each</span>
                      </div>
                    </div>

                    <div className="cart-item-controls">
                      {/* Quantity Controls */}
                      <div className="cart-counter">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          title="Decrease"
                        >
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          title="Increase"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="cart-item-subtotal">
                        ₹{item.price * item.quantity}
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{ color: '#9ca3af', padding: '4px' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cooking Notes */}
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '12px' }}>
                  Special Canteen Instructions (Optional):
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{ width: '100%', fontSize: '13px', padding: '9px 12px' }}
                  placeholder="e.g. Extra spicy, less oil, pack separately..."
                  value={cookingNotes}
                  onChange={(e) => setCookingNotes(e.target.value)}
                />
              </div>

              {/* OFFLINE PAYMENT GUARANTEE NOTICE */}
              <div className="offline-payment-box">
                <div className="offline-payment-icon">
                  <Banknote size={20} />
                </div>
                <div>
                  <div className="offline-payment-title">
                    💵 Offline Payment at Canteen Counter
                  </div>
                  <div className="offline-payment-desc">
                    <strong>No online payment required!</strong> Pay in cash or scan the canteen UPI QR 
                    code directly at the counter when you pick up your hot food.
                  </div>
                </div>
              </div>

              {/* Bill Details */}
              <div className="bill-summary">
                <div className="bill-row">
                  <span>Items Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="bill-row">
                  <span>Canteen Packaging & Handling</span>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>FREE (₹0)</span>
                </div>
                <div className="bill-row">
                  <span>Payment Mode</span>
                  <span style={{ fontWeight: 600 }}>Offline / Cash at Desk</span>
                </div>
                <div className="bill-row total">
                  <span>To Pay at Counter</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>

              {/* Pre-order Action Button */}
              <button 
                className="checkout-btn" 
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Submitting Pre-order...</span>
                ) : (
                  <>
                    <span>Place Pre-order • Pay ₹{cartTotal} at Counter</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
