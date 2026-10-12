import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  BellRing, 
  Banknote, 
  RefreshCw, 
  AlertCircle,
  Timer
} from 'lucide-react';

export default function OrderManager() {
  const { orders, ordersLoading, loadOrders, handleUpdateOrderStatus, showToast } = useApp();

  // Tab filter: 'ACTIVE' | 'ALL' | 'COMPLETED'
  const [filter, setFilter] = useState('ACTIVE');

  const filteredOrders = orders.filter((order) => {
    if (filter === 'ACTIVE') {
      return order.status !== 'COMPLETED' && order.status !== 'CANCELLED';
    }
    if (filter === 'COMPLETED') {
      return order.status === 'COMPLETED';
    }
    return true;
  });

  const handleStatusChange = async (orderId, newStatus, currentMins) => {
    let newMins = currentMins;
    if (newStatus === 'READY') newMins = 0;
    if (newStatus === 'COMPLETED') newMins = 0;
    if (newStatus === 'PREPARING' && (!newMins || newMins <= 0)) newMins = 10;

    await handleUpdateOrderStatus(orderId, newStatus, newMins);
  };

  const handleAdjustTime = async (order, delta) => {
    const current = Number(order.remainingTimeMinutes) || 10;
    const nextTime = Math.max(1, current + delta);
    await handleUpdateOrderStatus(order.id, order.status, nextTime);
    showToast(`Updated remaining time to ${nextTime} mins`, 'info');
  };

  return (
    <div className="animate-fade-in">
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`category-chip ${filter === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setFilter('ACTIVE')}
          >
            🔥 Active Kitchen Orders ({orders.filter(o => o.status !== 'COMPLETED').length})
          </button>
          <button
            className={`category-chip ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Orders ({orders.length})
          </button>
          <button
            className={`category-chip ${filter === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => setFilter('COMPLETED')}
          >
            Completed / Collected
          </button>
        </div>

        <button
          className="nav-btn"
          onClick={loadOrders}
          disabled={ordersLoading}
        >
          <RefreshCw size={14} className={ordersLoading ? 'animate-spin' : ''} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-menu-box" style={{ padding: '40px 20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>👨‍🍳</div>
          <h4>No {filter === 'ACTIVE' ? 'Active' : ''} Orders Found</h4>
          <p>
            When students place pre-orders through the student menu, they will appear here in real-time.
          </p>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.id} className="order-card animate-fade-in">
            {/* Top row */}
            <div className="order-card-header">
              <div>
                <div className="order-token">
                  <span>Token #{order.token}</span>
                </div>
                <div className="order-student-info">
                  Student: <strong>{order.studentName}</strong> (Roll: {order.studentRoll})
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Ordered at: {new Date(order.createdAt).toLocaleTimeString()}
                </div>
              </div>

              {/* Status & Amount to Collect */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534' }}>
                  ₹{order.totalAmount}
                </div>
                <div style={{ fontSize: '12px', color: '#b45309', fontWeight: 600 }}>
                  💵 Collect Offline (Cash/UPI)
                </div>
                <div style={{ marginTop: '6px' }}>
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
                      <BellRing size={12} /> Ready for Pickup
                    </span>
                  )}
                  {order.status === 'COMPLETED' && (
                    <span className="status-badge status-completed">
                      <CheckCircle size={12} /> Completed & Collected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Items list */}
            <div className="order-items-list">
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                ITEMS TO PREPARE:
              </span>
              {order.items.map((it, idx) => (
                <div key={idx} className="order-item-bullet">
                  <span>
                    <strong>{it.quantity}x</strong> {it.name}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>

            {order.notes && (
              <div style={{
                background: '#f8fafc',
                borderLeft: '3px solid #fc8019',
                padding: '6px 12px',
                fontSize: '12px',
                color: '#334155',
                margin: '8px 0',
                borderRadius: '0 4px 4px 0'
              }}>
                <strong>Student Note:</strong> "{order.notes}"
              </div>
            )}

            {/* Remaining Time & Status Controls */}
            <div className="order-controls-bar">
              {/* Remaining Prep Time editor */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Timer size={14} color="#ea580c" />
                  <span>Remaining Prep Time:</span>
                </span>
                
                <span style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: order.status === 'READY' ? '#16a34a' : '#ea580c',
                  background: '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {order.status === 'READY' || order.status === 'COMPLETED' ? '0 min (Ready)' : `${order.remainingTimeMinutes || 10} mins`}
                </span>

                {order.status !== 'COMPLETED' && order.status !== 'READY' && (
                  <div className="time-adjuster">
                    <button
                      className="time-btn"
                      onClick={() => handleAdjustTime(order, -5)}
                      title="Subtract 5 mins"
                    >
                      -5 min
                    </button>
                    <button
                      className="time-btn"
                      onClick={() => handleAdjustTime(order, 5)}
                      title="Add 5 mins"
                    >
                      +5 min
                    </button>
                  </div>
                )}
              </div>

              {/* Status Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {order.status !== 'PREPARING' && order.status !== 'COMPLETED' && (
                  <button
                    className="nav-btn"
                    style={{ background: '#fff7ed', borderColor: '#fdba74', color: '#c2410c', fontSize: '13px' }}
                    onClick={() => handleStatusChange(order.id, 'PREPARING', order.remainingTimeMinutes || 10)}
                  >
                    <ChefHat size={14} />
                    <span>Mark Preparing</span>
                  </button>
                )}

                {order.status !== 'READY' && order.status !== 'COMPLETED' && (
                  <button
                    className="nav-btn"
                    style={{ background: '#ecfdf5', borderColor: '#86efac', color: '#15803d', fontSize: '13px' }}
                    onClick={() => handleStatusChange(order.id, 'READY', 0)}
                  >
                    <BellRing size={14} />
                    <span>Mark Ready for Pickup</span>
                  </button>
                )}

                {order.status !== 'COMPLETED' && (
                  <button
                    className="nav-btn"
                    style={{ background: '#1e293b', color: '#fff', fontSize: '13px' }}
                    onClick={() => handleStatusChange(order.id, 'COMPLETED', 0)}
                  >
                    <CheckCircle size={14} />
                    <span>Done (Collected & Paid)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
