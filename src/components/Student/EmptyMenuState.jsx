import React from 'react';
import { useApp } from '../../context/AppContext';
import { UtensilsCrossed, PlusCircle, Sparkles, RefreshCw } from 'lucide-react';

export default function EmptyMenuState() {
  const { loginUser, loadDemoMenu, loadItems, itemsLoading } = useApp();

  return (
    <div className="empty-menu-box animate-fade-in">
      <div className="empty-icon-circle">
        <UtensilsCrossed size={40} />
      </div>

      <h3>Canteen Menu is Currently Empty</h3>
      
      <p>
        As designed, there are initially no food item cards hardcoded here. Items are populated 
        dynamically via your <strong>backend REST API</strong> (<code>GET /api/items</code>) or 
        created by canteen staff.
      </p>

      <div className="empty-action-group">
        {/* Switch to Staff Portal to add real items */}
        <button
          className="nav-btn nav-btn-primary"
          onClick={() => {
            loginUser({
              role: 'STAFF',
              name: 'Chef Ramesh',
              id: 'staff_101',
              title: 'Canteen Kitchen Supervisor',
            });
          }}
        >
          <PlusCircle size={16} />
          <span>Go to Staff Portal to Add Items</span>
        </button>

        {/* Load sample preview data */}
        <button
          className="nav-btn"
          onClick={loadDemoMenu}
          title="Populate sample items for UI testing"
        >
          <Sparkles size={16} color="#fc8019" />
          <span>Load Sample Menu (Demo)</span>
        </button>

        {/* Refresh API */}
        <button
          className="nav-btn"
          onClick={loadItems}
          disabled={itemsLoading}
          title="Reload items from backend"
        >
          <RefreshCw size={14} className={itemsLoading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
