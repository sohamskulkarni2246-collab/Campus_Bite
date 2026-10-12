import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import AuthPortal from './components/AuthPortal';
import StudentView from './components/Student/StudentView';
import StaffView from './components/Staff/StaffView';
import CartDrawer from './components/Student/CartDrawer';
import OrderTracker from './components/Student/OrderTracker';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import './App.css';

function MainApp() {
  const { user, toast } = useApp();

  return (
    <div className="app-container">
      {/* Toast Feedback */}
      {toast && (
        <div className={`toast-banner ${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
          {toast.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
          {toast.type === 'info' && <Info size={18} color="#3b82f6" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* If not logged in, immediately ask: Student or Staff, with Sign In & Sign Up */}
      {!user ? (
        <AuthPortal />
      ) : (
        <>
          {/* Navigation Header */}
          <Navbar />

          {/* Main Content Area based on User Role */}
          <main className="main-content">
            {user.role === 'STAFF' ? (
              <StaffView />
            ) : (
              <StudentView />
            )}
          </main>

          {/* Modals & Slide-out Panels */}
          <CartDrawer />
          <OrderTracker />

          {/* Footer */}
          <footer style={{
            marginTop: 'auto',
            background: '#fff',
            borderTop: '1px solid var(--border-color)',
            padding: '24px 20px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--text-primary)' }}>
                <span>CampusBite College Canteen Pre-order System</span>
              </div>
              <p style={{ maxWidth: '600px', fontSize: '12px', color: 'var(--text-muted)' }}>
                Designed with Swiggy & Zomato aesthetics for fast college break-time pre-orders. 
                Strictly offline payments at counter upon food collection. Backend-ready REST API endpoints.
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
