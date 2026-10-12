import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  ChefHat, 
  GraduationCap, 
  Clock, 
  LogOut, 
  LogIn, 
  MapPin, 
  Radio 
} from 'lucide-react';

export default function Navbar() {
  const { 
    user, 
    cartCount, 
    cartTotal, 
    setIsCartOpen, 
    setIsLoginOpen, 
    logoutUser, 
    setIsOrdersModalOpen,
    isBackendConnected,
    loginUser
  } = useApp();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo & College Canteen Location */}
        <div className="brand-section" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-logo">
            🍔
          </div>
          <div className="brand-text">
            <h1>CampusBite</h1>
            <div className="brand-location">
              <MapPin size={12} color="#fc8019" />
              <span>Main Campus Canteen • Block B</span>
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
          {/* User Role Badge / Quick Switcher */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className={`role-badge ${user.role === 'STAFF' ? 'staff' : 'student'}`}>
                {user.role === 'STAFF' ? (
                  <>
                    <ChefHat size={14} />
                    <span>Staff: {user.name}</span>
                  </>
                ) : (
                  <>
                    <GraduationCap size={14} />
                    <span>Student: {user.name}</span>
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

              {/* Quick Role Toggle (Useful for pairing & demoing between student and staff) */}
              <button 
                className="nav-btn"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={() => {
                  if (user.role === 'STUDENT') {
                    loginUser({ role: 'STAFF', name: 'Chef Ramesh', id: 'staff_101', title: 'Canteen Supervisor' });
                  } else {
                    loginUser({ role: 'STUDENT', name: 'Rahul Sharma', rollNo: 'CS-2024-42', department: 'Computer Science' });
                  }
                }}
                title="Switch between Student and Staff view"
              >
                Switch to {user.role === 'STUDENT' ? 'Staff' : 'Student'}
              </button>

              <button 
                className="nav-btn" 
                onClick={logoutUser}
                title="Logout"
                style={{ padding: '8px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="nav-btn nav-btn-primary" onClick={() => setIsLoginOpen(true)}>
              <LogIn size={16} />
              <span>Login (Student / Staff)</span>
            </button>
          )}

          {/* Cart Button (Always visible for students) */}
          {(!user || user.role === 'STUDENT') && (
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
