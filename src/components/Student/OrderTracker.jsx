import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Clock, 
  CheckCircle, 
  ChefHat, 
  BellRing, 
  Receipt, 
  Sparkles, 
  RotateCw 
} from 'lucide-react';

export default function OrderTracker() {
  const { 
    orders, 
    ordersLoading, 
    loadOrders, 
    isOrdersModalOpen, 
    setIsOrdersModalOpen, 
    user 
  } = useApp();

  if (!isOrdersModalOpen) return null;

  // Filter orders for the logged in student
  const studentOrders = user && user.role === 'STUDENT'
    ? orders.filter((o) => o.studentRoll === user.rollNo)
    : orders;

  const getStepIndex = (status) => {
    switch (status) {
      case 'RECEIVED': return 1;
      case 'PREPARING': return 2;
      case 'READY': return 3;
      case 'COMPLETED': return 4;
      default: return 1;
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsOrdersModalOpen(false)}>
      <div 
        className="modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={20} color="#fc8019" />
            <h3>My Pre-orders & Live Status</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="modal-close-btn" 
              onClick={loadOrders} 
              title="Refresh order status"
            >
              <RotateCw size={16} className={ordersLoading ? 'animate-spin' : ''} />
            </button>
            <button 
              className="modal-close-btn" 
              onClick={() => setIsOrdersModalOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {studentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>No Pre-orders Placed Yet</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                When you place a pre-order, you can track real-time kitchen preparation and remaining time here!
              </p>
            </div>
          ) : (
            studentOrders.map((order) => {
              const currentStep = getStepIndex(order.status);

              return (
                <div key={order.id} className="order-card" style={{ marginBottom: '20px' }}>
                  {/* Order Card Header */}
                  <div className="order-card-header">
                    <div>
                      <div className="order-token">
                        <span>Token #{order.token}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Placed: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {order.status === 'RECEIVED' && (
                        <span className="status-badge status-received">
                          <Clock size={12} /> Received
                        </span>
                      )}
                      {order.status === 'PREPARING' && (
                        <span className="status-badge status-preparing">
                          <ChefHat size={12} /> Kitchen Preparing
                        </span>
                      )}
                      {order.status === 'READY' && (
                        <span className="status-badge status-ready">
                          <BellRing size={12} /> Ready for Pickup!
                        </span>
                      )}
                      {order.status === 'COMPLETED' && (
                        <span className="status-badge status-completed">
                          <CheckCircle size={12} /> Collected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Stepper */}
                  <div className="tracker-stepper">
                    <div className={`tracker-step ${currentStep >= 1 ? (currentStep > 1 ? 'completed' : 'active') : ''}`}>
                      <div className="tracker-circle">1</div>
                      <span className="tracker-label">Received</span>
                    </div>

                    <div className={`tracker-step ${currentStep >= 2 ? (currentStep > 2 ? 'completed' : 'active') : ''}`}>
                      <div className="tracker-circle">2</div>
                      <span className="tracker-label">Preparing</span>
                    </div>

                    <div className={`tracker-step ${currentStep >= 3 ? (currentStep > 3 ? 'completed' : 'active') : ''}`}>
                      <div className="tracker-circle">3</div>
                      <span className="tracker-label">Ready</span>
                    </div>

                    <div className={`tracker-step ${currentStep === 4 ? 'completed' : ''}`}>
                      <div className="tracker-circle">4</div>
                      <span className="tracker-label">Done</span>
                    </div>
                  </div>

                  {/* Live Preparation Time Callout */}
                  <div style={{
                    background: order.status === 'READY' ? '#ecfdf5' : '#fff7ed',
                    border: `1px solid ${order.status === 'READY' ? '#a7f3d0' : '#fed7aa'}`,
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} color={order.status === 'READY' ? '#059669' : '#ea580c'} />
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: order.status === 'READY' ? '#065f46' : '#9a3412',
                      }}>
                        {order.status === 'READY' ? (
                          '🔔 Your order is READY! Please collect at Counter #1'
                        ) : order.status === 'COMPLETED' ? (
                          '✅ Order collected and completed.'
                        ) : (
                          `Estimated remaining time: ~${order.remainingTimeMinutes ?? 12} mins`
                        )}
                      </span>
                    </div>

                    {order.status === 'PREPARING' && (
                      <span style={{
                        fontSize: '11px',
                        background: '#ea580c',
                        color: '#fff',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}>
                        Live
                      </span>
                    )}
                  </div>

                  {/* Items Summary */}
                  <div className="order-items-list">
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      ITEMS IN THIS ORDER:
                    </span>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="order-item-bullet">
                        <span>
                          {it.quantity}x {it.name}
                        </span>
                        <span style={{ fontWeight: 600 }}>₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Offline Payment Reminder */}
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px dashed #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Payment (Offline): <strong>Pay ₹{order.totalAmount} at Counter</strong>
                    </span>
                    <span style={{
                      fontWeight: 700,
                      color: order.paymentStatus === 'PAID_COLLECTED' ? '#16a34a' : '#d97706',
                    }}>
                      {order.paymentStatus === 'PAID_COLLECTED' ? '✓ Paid' : '⏳ Pay Upon Pickup'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
