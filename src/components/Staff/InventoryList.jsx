import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trash2, Plus, Minus, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';

export default function InventoryList() {
  const { items, updateItemDetails, deleteItem, loadDemoMenu, clearCurrentMenu, loadItems } = useApp();

  const handleStockChange = (item, delta) => {
    const nextQty = Math.max(0, item.quantity + delta);
    updateItemDetails(item.id, { quantity: nextQty });
  };

  return (
    <div className="animate-fade-in">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>📦 Current Menu Items ({items.length})</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Manage quantities, availability, and delete items from the canteen menu.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="nav-btn" onClick={loadItems}>
            <RefreshCw size={14} />
            <span>Reload</span>
          </button>
          <button className="nav-btn" onClick={loadDemoMenu}>
            <Sparkles size={14} color="#fc8019" />
            <span>Load Demo Menu</span>
          </button>
          <button 
            className="nav-btn" 
            onClick={clearCurrentMenu}
            style={{ color: '#ef4444' }}
            title="Reset menu to empty state"
          >
            Clear Menu (Empty)
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-menu-box" style={{ padding: '40px 20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍽️</div>
          <h4>No items in menu</h4>
          <p>Click "Add Food Item" above or click "Load Demo Menu" to seed sample items.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item) => (
            <div
              key={item.id}
              className="form-card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              {/* Left: Thumbnail & Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '240px' }}>
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={item.isVeg ? 'veg-badge' : 'non-veg-badge'}></span>
                    <h4 style={{ fontSize: '15px', fontWeight: 800 }}>{item.name}</h4>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Category: <strong>{item.category}</strong> • Prep: ~{item.prepTime || 10} mins
                  </div>
                </div>
              </div>

              {/* Price */}
              <div style={{ minWidth: '80px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Price</div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>₹{item.price}</div>
              </div>

              {/* Stock Quantity Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Stock Qty</div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: item.quantity <= 0 ? '#dc2626' : item.quantity <= 5 ? '#d97706' : '#16a34a'
                  }}>
                    {item.quantity <= 0 ? 'Out of Stock' : `${item.quantity} available`}
                  </div>
                </div>

                <div className="cart-counter">
                  <button onClick={() => handleStockChange(item, -5)} title="-5 stock">-5</button>
                  <button onClick={() => handleStockChange(item, -1)} title="-1 stock"><Minus size={12} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleStockChange(item, 1)} title="+1 stock"><Plus size={12} /></button>
                  <button onClick={() => handleStockChange(item, 5)} title="+5 stock">+5</button>
                </div>
              </div>

              {/* Actions */}
              <div>
                <button
                  className="nav-btn"
                  onClick={() => deleteItem(item.id)}
                  style={{ color: '#ef4444', borderColor: '#fecaca', padding: '8px 12px' }}
                  title="Delete item from menu"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
