import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AddItemForm from './AddItemForm';
import OrderManager from './OrderManager';
import InventoryList from './InventoryList';
import { PlusCircle, ClipboardList, Package, ChefHat, Sparkles } from 'lucide-react';

export default function StaffView() {
  const { user, orders, items } = useApp();

  // Active tab: 'ADD_ITEM' | 'ORDERS' | 'INVENTORY'
  const [activeTab, setActiveTab] = useState('ADD_ITEM');

  const pendingOrdersCount = orders.filter(
    (o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
  ).length;

  return (
    <div className="staff-container animate-fade-in">
      {/* Staff Header Banner */}
      <div className="staff-header-banner">
        <div>
          <h2>Canteen Staff Operations Hub 👨‍🍳</h2>
          <p>
            Logged in as <strong>{user?.name}</strong> • {user?.canteenName || 'Campus Canteen'} ({user?.counterLocation || 'Main Counter'})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.12)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
          }}>
            Pending Orders: <strong style={{ color: '#fed7aa' }}>{pendingOrdersCount}</strong>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.12)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
          }}>
            Menu Items: <strong style={{ color: '#fed7aa' }}>{items.length}</strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="staff-tabs">
        <button
          className={`staff-tab-btn ${activeTab === 'ADD_ITEM' ? 'active' : ''}`}
          onClick={() => setActiveTab('ADD_ITEM')}
        >
          <PlusCircle size={18} />
          <span>Add New Food Item</span>
        </button>

        <button
          className={`staff-tab-btn ${activeTab === 'ORDERS' ? 'active' : ''}`}
          onClick={() => setActiveTab('ORDERS')}
        >
          <ClipboardList size={18} />
          <span>Live Orders & Status</span>
          {pendingOrdersCount > 0 && (
            <span className="staff-badge-counter">{pendingOrdersCount}</span>
          )}
        </button>

        <button
          className={`staff-tab-btn ${activeTab === 'INVENTORY' ? 'active' : ''}`}
          onClick={() => setActiveTab('INVENTORY')}
        >
          <Package size={18} />
          <span>Menu Inventory ({items.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'ADD_ITEM' && (
        <AddItemForm onAdded={() => setActiveTab('INVENTORY')} />
      )}

      {activeTab === 'ORDERS' && (
        <OrderManager />
      )}

      {activeTab === 'INVENTORY' && (
        <InventoryList />
      )}
    </div>
  );
}
