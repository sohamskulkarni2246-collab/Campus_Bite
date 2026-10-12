import React from 'react';
import { useApp } from '../../context/AppContext';
import { UtensilsCrossed, RefreshCw } from 'lucide-react';

export default function EmptyMenuState() {
  const { loadItems, itemsLoading } = useApp();

  return (
    <div className="empty-menu-box animate-fade-in">
      <div className="empty-icon-circle">
        <UtensilsCrossed size={40} />
      </div>

      <h3>Canteen Menu is Currently Empty</h3>
      
      <p>
        There are currently no food items published on the menu. 
        Once the canteen staff adds items from their dashboard or via the backend API, 
        they will appear here instantly!
      </p>

      <div className="empty-action-group">
        <button
          className="nav-btn nav-btn-primary"
          onClick={loadItems}
          disabled={itemsLoading}
          title="Reload items from canteen"
        >
          <RefreshCw size={14} className={itemsLoading ? 'animate-spin' : ''} />
          <span>Refresh Menu</span>
        </button>
      </div>
    </div>
  );
}
