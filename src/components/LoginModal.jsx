import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, GraduationCap, ChefHat, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function LoginModal() {
  const { isLoginOpen, setIsLoginOpen, loginUser, showToast } = useApp();

  // Selected tab: 'STUDENT' or 'STAFF'
  const [selectedRole, setSelectedRole] = useState('STUDENT');

  // Student form state
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentDept, setStudentDept] = useState('');

  // Staff form state
  const [staffId, setStaffId] = useState('');
  const [staffPin, setStaffPin] = useState('');

  if (!isLoginOpen) return null;

  const handleStudentLogin = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentRoll.trim()) {
      showToast('Please enter both Name and Roll Number', 'warning');
      return;
    }

    loginUser({
      role: 'STUDENT',
      name: studentName.trim(),
      rollNo: studentRoll.trim().toUpperCase(),
      department: studentDept.trim() || 'General Student',
    });
  };

  const handleStaffLogin = (e) => {
    e.preventDefault();
    if (!staffId.trim() || !staffPin.trim()) {
      showToast('Please enter Staff ID and Security PIN', 'warning');
      return;
    }

    // Default demo staff PIN check (PIN: 1234 or any during dev)
    loginUser({
      role: 'STAFF',
      name: staffId.trim() === 'manager' ? 'Canteen Manager' : 'Chef Ramesh',
      id: staffId.trim(),
      title: 'Canteen Kitchen Supervisor',
    });
  };

  // Demo helpers
  const fillStudentDemo = () => {
    setStudentName('Rahul Sharma');
    setStudentRoll('CS-2024-42');
    setStudentDept('B.Tech CSE - 3rd Year');
  };

  const fillStaffDemo = () => {
    setStaffId('canteen_manager');
    setStaffPin('1234');
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsLoginOpen(false)}>
      <div 
        className="modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3>Welcome to CampusBite</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Select your role to access the pre-order system
            </p>
          </div>
          <button className="modal-close-btn" onClick={() => setIsLoginOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Two Role Options Tab */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: '#f1f3f5',
            padding: '6px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => setSelectedRole('STUDENT')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '13px',
                background: selectedRole === 'STUDENT' ? '#fff' : 'transparent',
                color: selectedRole === 'STUDENT' ? '#fc8019' : 'var(--text-secondary)',
                boxShadow: selectedRole === 'STUDENT' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <GraduationCap size={16} />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('STAFF')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '13px',
                background: selectedRole === 'STAFF' ? '#fff' : 'transparent',
                color: selectedRole === 'STAFF' ? '#e23744' : 'var(--text-secondary)',
                boxShadow: selectedRole === 'STAFF' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <ChefHat size={16} />
              <span>Canteen Staff</span>
            </button>
          </div>

          {/* Student Form */}
          {selectedRole === 'STUDENT' ? (
            <form onSubmit={handleStudentLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Roll Number / Student ID *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. CS-2024-42"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department / Year (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. B.Tech Computer Science"
                  value={studentDept}
                  onChange={(e) => setStudentDept(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={fillStudentDemo}
                  style={{ fontSize: '12px', color: '#fc8019', fontWeight: 600 }}
                >
                  ⚡ Autofill Demo Student
                </button>
              </div>

              <button
                type="submit"
                className="checkout-btn"
                style={{ marginTop: '10px' }}
              >
                <span>Enter as Student</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* Staff Form */
            <form onSubmit={handleStaffLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: '#fff7ed',
                border: '1px solid #ffedd5',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                color: '#9a3412',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={16} color="#ea580c" />
                <span>Staff Portal allows adding food items and updating live orders.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Staff ID / Username *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. canteen_manager or chef_ramesh"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Security PIN / Password *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Demo PIN: 1234"
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={fillStaffDemo}
                  style={{ fontSize: '12px', color: '#e23744', fontWeight: 600 }}
                >
                  ⚡ Autofill Demo Staff (PIN: 1234)
                </button>
              </div>

              <button
                type="submit"
                className="checkout-btn"
                style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', marginTop: '10px' }}
              >
                <span>Enter Staff Portal</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
