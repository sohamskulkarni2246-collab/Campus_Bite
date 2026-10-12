import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  ChefHat, 
  ArrowRight, 
  ArrowLeft, 
  Store, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function AuthPortal() {
  const { registerStudent, loginStudent, registerStaff, loginStaff } = useApp();

  // Selected role: null (choice screen), 'STUDENT', 'STAFF'
  const [selectedRole, setSelectedRole] = useState(null);

  // Active auth mode: 'SIGNIN' | 'SIGNUP'
  const [authMode, setAuthMode] = useState('SIGNIN');

  // Error message
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student Sign In State
  const [studentSignInIdent, setStudentSignInIdent] = useState('');
  const [studentSignInPass, setStudentSignInPass] = useState('');

  // Student Sign Up State
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentDept, setStudentDept] = useState('');
  const [studentPass, setStudentPass] = useState('');
  const [studentConfirmPass, setStudentConfirmPass] = useState('');

  // Staff Sign In State
  const [staffSignInIdent, setStaffSignInIdent] = useState('');
  const [staffSignInPass, setStaffSignInPass] = useState('');

  // Staff & New Canteen Sign Up State
  const [canteenName, setCanteenName] = useState('');
  const [counterLocation, setCounterLocation] = useState('');
  const [managerName, setManagerName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffPass, setStaffPass] = useState('');
  const [staffConfirmPass, setStaffConfirmPass] = useState('');

  // -----------------------------------------------------------
  // HANDLERS
  // -----------------------------------------------------------
  const handleStudentSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!studentSignInIdent.trim() || !studentSignInPass.trim()) {
      setErrorMessage('Please enter both Roll Number/Email and Password.');
      return;
    }

    setIsSubmitting(true);
    const res = await loginStudent(studentSignInIdent.trim(), studentSignInPass.trim());
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Invalid credentials. Please try again.');
    }
  };

  const handleStudentSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!studentName.trim() || !studentRoll.trim() || !studentPass.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Roll No, Password).');
      return;
    }

    if (studentPass !== studentConfirmPass) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    const res = await registerStudent({
      name: studentName.trim(),
      rollNo: studentRoll.trim().toUpperCase(),
      email: studentEmail.trim(),
      phone: studentPhone.trim(),
      department: studentDept.trim(),
      password: studentPass.trim(),
    });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  const handleStaffSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!staffSignInIdent.trim() || !staffSignInPass.trim()) {
      setErrorMessage('Please enter both Staff ID/Username and Password.');
      return;
    }

    setIsSubmitting(true);
    const res = await loginStaff(staffSignInIdent.trim(), staffSignInPass.trim());
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Invalid credentials.');
    }
  };

  const handleStaffSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!canteenName.trim() || !managerName.trim() || !staffId.trim() || !staffPass.trim()) {
      setErrorMessage('Please fill in Canteen Name, Manager Name, Staff ID, and Password.');
      return;
    }

    if (staffPass !== staffConfirmPass) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    const res = await registerStaff({
      canteenName: canteenName.trim(),
      counterLocation: counterLocation.trim() || 'Main Counter',
      managerName: managerName.trim(),
      staffId: staffId.trim().toLowerCase(),
      email: staffEmail.trim(),
      phone: staffPhone.trim(),
      password: staffPass.trim(),
    });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  // -----------------------------------------------------------
  // VIEW 1: ROLE SELECTION SCREEN (STUDENT OR STAFF)
  // -----------------------------------------------------------
  if (!selectedRole) {
    return (
      <div className="auth-portal-wrapper animate-fade-in">
        <div className="auth-portal-card" style={{ maxWidth: '680px' }}>
          {/* Logo & Headline */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="brand-logo" style={{ width: '56px', height: '56px', fontSize: '28px', margin: '0 auto 14px' }}>
              🍔
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1c1c1c', letterSpacing: '-0.5px' }}>
              Welcome to CampusBite
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              College Canteen Pre-Order & Kitchen Management System
            </p>
          </div>

          <div style={{
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: '26px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#9a3412' }}>
              Who are you? Please choose your role to get started:
            </h3>
          </div>

          {/* Two Big Role Choice Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {/* Student Card */}
            <div
              className="role-selection-card student-card"
              onClick={() => {
                setSelectedRole('STUDENT');
                setAuthMode('SIGNIN');
                setErrorMessage('');
              }}
            >
              <div className="role-icon-circle student-icon">
                <GraduationCap size={32} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
                I am a Student
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                Browse today's canteen menu, pre-order meals to skip lunch lines, track live kitchen prep time, and pay cash at the counter.
              </p>
              <button className="role-action-btn student-btn">
                <span>Continue as Student</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Staff / Canteen Card */}
            <div
              className="role-selection-card staff-card"
              onClick={() => {
                setSelectedRole('STAFF');
                setAuthMode('SIGNIN');
                setErrorMessage('');
              }}
            >
              <div className="role-icon-circle staff-icon">
                <ChefHat size={32} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
                Canteen Staff / Outlet
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                Register a new canteen or sign in to manage food items, accept student preorders, adjust prep time, and control inventory.
              </p>
              <button className="role-action-btn staff-btn">
                <span>Continue as Staff</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // VIEW 2: AUTH SCREEN FOR STUDENT
  // -----------------------------------------------------------
  if (selectedRole === 'STUDENT') {
    return (
      <div className="auth-portal-wrapper animate-fade-in">
        <div className="auth-portal-card" style={{ maxWidth: '480px' }}>
          {/* Back Button */}
          <button
            type="button"
            className="back-btn"
            onClick={() => {
              setSelectedRole(null);
              setErrorMessage('');
            }}
          >
            <ArrowLeft size={16} />
            <span>Change Role (Back)</span>
          </button>

          <div style={{ textAlign: 'center', margin: '14px 0 20px' }}>
            <div className="role-icon-circle student-icon" style={{ width: '48px', height: '48px', margin: '0 auto 10px' }}>
              <GraduationCap size={24} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Student Portal</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {authMode === 'SIGNIN' ? 'Sign in to access canteen menu & orders' : 'Create your student pre-order account'}
            </p>
          </div>

          {/* Toggle Tabs: Sign In / Sign Up */}
          <div className="auth-tab-group">
            <button
              className={`auth-tab-btn ${authMode === 'SIGNIN' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('SIGNIN');
                setErrorMessage('');
              }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${authMode === 'SIGNUP' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('SIGNUP');
                setErrorMessage('');
              }}
            >
              Sign Up (New Student)
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="auth-error-banner">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Student Sign In Form */}
          {authMode === 'SIGNIN' ? (
            <form onSubmit={handleStudentSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Student Roll Number or Email *</label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-field-icon" />
                  <input
                    type="text"
                    className="form-control with-icon"
                    placeholder="e.g. CS-2024-42 or student@college.edu"
                    value={studentSignInIdent}
                    onChange={(e) => setStudentSignInIdent(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-field-icon" />
                  <input
                    type="password"
                    className="form-control with-icon"
                    placeholder="Enter your password"
                    value={studentSignInPass}
                    onChange={(e) => setStudentSignInPass(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="checkout-btn"
                disabled={isSubmitting}
                style={{ marginTop: '8px' }}
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In as Student'}</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Don't have an account yet?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('SIGNUP');
                    setErrorMessage('');
                  }}
                  style={{ fontSize: '13px', color: '#fc8019', fontWeight: 700 }}
                >
                  Sign Up Here
                </button>
              </div>
            </form>
          ) : (
            /* Student Sign Up Form */
            <form onSubmit={handleStudentSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                <label className="form-label">Student Roll Number / College ID *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. CS-2024-42"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid" style={{ marginBottom: 0, gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">College Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="student@college.edu"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="e.g. 9876543210"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Department / Year</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. B.Tech Computer Science 3rd Year"
                  value={studentDept}
                  onChange={(e) => setStudentDept(e.target.value)}
                />
              </div>

              <div className="form-grid" style={{ marginBottom: 0, gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Create Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={studentPass}
                    onChange={(e) => setStudentPass(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm password"
                    value={studentConfirmPass}
                    onChange={(e) => setStudentConfirmPass(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="checkout-btn"
                disabled={isSubmitting}
                style={{ marginTop: '8px' }}
              >
                <span>{isSubmitting ? 'Creating Student Account...' : 'Create Student Account'}</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Already registered?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('SIGNIN');
                    setErrorMessage('');
                  }}
                  style={{ fontSize: '13px', color: '#fc8019', fontWeight: 700 }}
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // VIEW 3: AUTH SCREEN FOR STAFF & NEW CANTEEN REGISTRATION
  // -----------------------------------------------------------
  return (
    <div className="auth-portal-wrapper animate-fade-in">
      <div className="auth-portal-card" style={{ maxWidth: '520px' }}>
        {/* Back Button */}
        <button
          type="button"
          className="back-btn"
          onClick={() => {
            setSelectedRole(null);
            setErrorMessage('');
          }}
        >
          <ArrowLeft size={16} />
          <span>Change Role (Back)</span>
        </button>

        <div style={{ textAlign: 'center', margin: '14px 0 20px' }}>
          <div className="role-icon-circle staff-icon" style={{ width: '48px', height: '48px', margin: '0 auto 10px' }}>
            <ChefHat size={24} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Canteen Staff Portal</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {authMode === 'SIGNIN' ? 'Sign in to your canteen dashboard' : 'Register a new canteen outlet for your campus'}
          </p>
        </div>

        {/* Toggle Tabs: Sign In / Sign Up */}
        <div className="auth-tab-group">
          <button
            className={`auth-tab-btn ${authMode === 'SIGNIN' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('SIGNIN');
              setErrorMessage('');
            }}
          >
            Staff Sign In
          </button>
          <button
            className={`auth-tab-btn ${authMode === 'SIGNUP' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('SIGNUP');
              setErrorMessage('');
            }}
          >
            Sign Up (New Canteen)
          </button>
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Staff Sign In Form */}
        {authMode === 'SIGNIN' ? (
          <form onSubmit={handleStaffSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Staff ID / Username or Email *</label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-field-icon" />
                <input
                  type="text"
                  className="form-control with-icon"
                  placeholder="e.g. central_canteen or staff_block_b"
                  value={staffSignInIdent}
                  onChange={(e) => setStaffSignInIdent(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-field-icon" />
                <input
                  type="password"
                  className="form-control with-icon"
                  placeholder="Enter your security password"
                  value={staffSignInPass}
                  onChange={(e) => setStaffSignInPass(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="checkout-btn"
              disabled={isSubmitting}
              style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', marginTop: '8px' }}
            >
              <span>{isSubmitting ? 'Verifying...' : 'Sign In to Canteen Portal'}</span>
              <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Want to register a new canteen?{' '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('SIGNUP');
                  setErrorMessage('');
                }}
                style={{ fontSize: '13px', color: '#e23744', fontWeight: 700 }}
              >
                Register New Canteen Here
              </button>
            </div>
          </form>
        ) : (
          /* Staff & New Canteen Sign Up Form */
          <form onSubmit={handleStaffSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Canteen / Food Outlet Name *</label>
              <div className="auth-input-wrapper">
                <Store size={16} className="auth-field-icon" />
                <input
                  type="text"
                  className="form-control with-icon"
                  placeholder="e.g. Central Mess, Block B Food Court, Sunrise Cafe"
                  value={canteenName}
                  onChange={(e) => setCanteenName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Canteen Counter Location / Room *</label>
              <div className="auth-input-wrapper">
                <MapPin size={16} className="auth-field-icon" />
                <input
                  type="text"
                  className="form-control with-icon"
                  placeholder="e.g. Campus Block B - Counter #2, Main Building"
                  value={counterLocation}
                  onChange={(e) => setCounterLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: 0, gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Manager / Staff In-Charge Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramesh Kumar"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Staff ID / Login Username *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. canteen_block_b"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: 0, gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="canteen@campus.edu"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="e.g. 9812345678"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: 0, gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Create password"
                  value={staffPass}
                  onChange={(e) => setStaffPass(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  value={staffConfirmPass}
                  onChange={(e) => setStaffConfirmPass(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="checkout-btn"
              disabled={isSubmitting}
              style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', marginTop: '8px' }}
            >
              <span>{isSubmitting ? 'Registering Canteen...' : 'Register Canteen & Create Account'}</span>
              <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Already registered?{' '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('SIGNIN');
                  setErrorMessage('');
                }}
                style={{ fontSize: '13px', color: '#e23744', fontWeight: 700 }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
