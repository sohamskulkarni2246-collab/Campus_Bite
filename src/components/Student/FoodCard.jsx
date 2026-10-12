import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Plus, Minus, AlertCircle } from 'lucide-react';

export default function FoodCard({ item }) {
  const { cart, addToCart, updateCartQuantity } = useApp();

  const cartItem = cart.find((c) => c.id === item.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = item.quantity <= 0;

  // Fallback food image if user provided none or broken link
  const displayImage = item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="food-card animate-fade-in">
      {/* Food Image Box */}
      <div className="food-card-image-box">
        <img 
          src={displayImage} 
          alt={item.name} 
          className="food-card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Veg / Non-Veg Badge */}
        <div className="food-card-overlay-badge">
          <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'}></span>
          <span>{item.isVeg ? 'VEG' : 'NON-VEG'}</span>
        </div>

        {/* Preparation Time Tag */}
        {item.prepTime && (
          <div className="food-card-prep-time">
            <Clock size={11} />
            <span>{item.prepTime}m prep</span>
          </div>
        )}

        {/* Swiggy Signature Floating Add / Counter Button */}
        <div className="floating-add-container">
          {isOutOfStock ? (
            <div className="swiggy-add-btn" style={{ color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2', cursor: 'not-allowed' }}>
              SOLD OUT
            </div>
          ) : currentQuantity === 0 ? (
            <button 
              className="swiggy-add-btn" 
              onClick={() => addToCart(item)}
              title="Add to pre-order cart"
            >
              <span>ADD</span>
              <Plus size={14} style={{ marginLeft: '4px' }} />
            </button>
          ) : (
            <div className="swiggy-counter">
              <button 
                className="swiggy-counter-btn" 
                onClick={() => updateCartQuantity(item.id, currentQuantity - 1)}
                title="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="swiggy-counter-value">{currentQuantity}</span>
              <button 
                className="swiggy-counter-btn" 
                onClick={() => updateCartQuantity(item.id, currentQuantity + 1)}
                title="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Food Card Body */}
      <div className="food-card-body">
        <div className="food-card-title-row">
          <h3 className="food-card-title">{item.name}</h3>
        </div>

        {item.description ? (
          <p className="food-card-desc">{item.description}</p>
        ) : (
          <p className="food-card-desc" style={{ fontStyle: 'italic', color: '#9ca3af' }}>
            Freshly prepared at the college canteen counter.
          </p>
        )}

        {/* Footer with Price and Stock Indicator */}
        <div className="food-card-footer">
          <div className="food-price">
            ₹{item.price}
          </div>

          <div>
            {isOutOfStock ? (
              <span className="stock-pill stock-out">Out of Stock</span>
            ) : item.quantity <= 5 ? (
              <span className="stock-pill stock-low">Only {item.quantity} left!</span>
            ) : (
              <span className="stock-pill stock-in">In Stock ({item.quantity})</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
