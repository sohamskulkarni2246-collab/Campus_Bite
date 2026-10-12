import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  ChefHat, 
  GraduationCap, 
  Clock, 
  LogOut, 
  MapPin, 
  Radio,
  Store
} from 'lucide-react';

export default function Navbar() {
  const { 
    user, 
    cartCount, 
    cartTotal, 
    setIsCartOpen, 
    logoutUser, 
    setIsOrdersModalOpen,
    isBackendConnected
  } = useApp();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo & Canteen Info */}
        <div className="brand-section" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-logo">
            🍔
          </div>
          <div className="brand-text">
            <h1>CampusBite</h1>
            <div className="brand-location">
              <MapPin size={12} color="#fc8019" />
              <span>
                {user?.role === 'STAFF' && user.canteenName
                  ? `${user.canteenName} • ${user.counterLocation || 'Main Counter'}`
                  : 'College Canteen • Campus Food Court'}
              </span>
            </div>
          </div>
        </div>

        {/* Backend Connectivity Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            title={
              isBackendConnected 
                ? "Connected to Live REST Backend API" 
                : "Running in Browser Storage mode. When backend is started at http://localhost:5000/api, it syncs automatically."
            }
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              background: isBackendConnected ? '#ecfdf5' : '#fffbeb',
              color: isBackendConnected ? '#059669' : '#b45309',
              border: `1px solid ${isBackendConnected ? '#a7f3d0' : '#fde68a'}`,
            }}
          >
            <Radio size={12} />
            {isBackendConnected ? 'Backend: Live' : 'Backend: Ready for API'}
          </span>
        </div>

        {/* Nav Actions */}
        <div className="nav-actions">
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* User Identity Badge */}
              <div className={`role-badge ${user.role === 'STAFF' ? 'staff' : 'student'}`}>
                {user.role === 'STAFF' ? (
                  <>
                    <Store size={14} />
                    <span>{user.canteenName || 'Canteen'}: {user.name}</span>
                  </>
                ) : (
                  <>
                    <GraduationCap size={14} />
                    <span>Student: {user.name} ({user.rollNo})</span>
                  </>
                )}
              </div>

              {/* Student Live Orders / Tracking button */}
              {user.role === 'STUDENT' && (
                <button 
                  className="nav-btn"
                  onClick={() => setIsOrdersModalOpen(true)}
                  title="Track Active Pre-orders"
                >
                  <Clock size={16} color="#fc8019" />
                  <span>My Preorders</span>
                </button>
              )}

              {/* Sign Out Button */}
              <button 
                className="nav-btn" 
                onClick={logoutUser}
                title="Sign out of CampusBite"
                style={{ color: '#ef4444', borderColor: '#fecaca' }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Cart Button (Always visible for logged in students) */}
          {user?.role === 'STUDENT' && (
            <button 
              className="nav-btn cart-btn" 
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={18} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="cart-count-badge">{cartCount}</span>
              )}
              {cartTotal > 0 && (
                <span style={{ fontSize: '13px', marginLeft: '2px' }}>₹{cartTotal}</span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
