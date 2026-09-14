import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/auth';
import AuthLayout from '../components/AuthLayout';
import './Auth.css';

const ROLES = [
  {
    id: 'student',
    icon: '🎓',
    label: 'Student',
    desc: 'I want to learn',
    color: '#8B5CF6',
  },
  {
    id: 'mentor',
    icon: '🧑‍🏫',
    label: 'Mentor',
    desc: 'I want to teach',
    color: '#00D2FF',
  },
  {
    id: 'centre',
    icon: '🏫',
    label: 'Centre',
    desc: 'Register my institution',
    color: '#FF6B35',
  },
];

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = role select, 2 = details
  const [selectedRole, setSelectedRole] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    if (error) setError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: selectedRole,
      };

      const res = await registerUser(payload);
      const { user, token } = res.data.data;
      login(user, token);

      const routes = {
        student: '/student',
        mentor: '/mentor',
        centre: '/centre',
      };
      navigate(routes[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 1: Role selector ────────────────────────────────────
  if (step === 1) {
    return (
      <AuthLayout>
        <div className="auth-form-container">
          <div className="auth-form-header">
            <div className="auth-form-logo">
              <span>⚡</span>
              <span className="auth-form-logo-text">EduSpark</span>
            </div>
            <h2 className="auth-form-title">Join EduSpark</h2>
            <p className="auth-form-sub">Who are you? Choose your role to get started.</p>
          </div>

          <div className="role-selector">
            {ROLES.map((role) => (
              <button
                key={role.id}
                id={`role-btn-${role.id}`}
                type="button"
                className={`role-card ${selectedRole === role.id ? 'role-card--selected' : ''}`}
                onClick={() => setSelectedRole(role.id)}
                style={{ '--role-color': role.color }}
              >
                <div className="role-card-icon">{role.icon}</div>
                <div className="role-card-content">
                  <span className="role-card-label">{role.label}</span>
                  <span className="role-card-desc">{role.desc}</span>
                </div>
                <div className="role-card-check">
                  {selectedRole === role.id && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            id="role-continue-btn"
            type="button"
            className="btn btn-primary btn-lg btn-full"
            disabled={!selectedRole}
            onClick={() => setStep(2)}
          >
            Continue
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <div className="auth-form-footer">
            <span className="text-muted">Already have an account?</span>
            <Link to="/login" className="auth-link">Sign in</Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // ── STEP 2: Registration form ─────────────────────────────────
  return (
    <AuthLayout>
      <div className="auth-form-container">
        {/* Header */}
        <div className="auth-form-header">
          <div className="auth-form-logo">
            <span>⚡</span>
            <span className="auth-form-logo-text">EduSpark</span>
          </div>
          <div className="step-back-row">
            <button type="button" className="step-back-btn" onClick={() => setStep(1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Change role
            </button>
            <div className="selected-role-badge" style={{ '--role-color': ROLES.find(r => r.id === selectedRole)?.color }}>
              {ROLES.find(r => r.id === selectedRole)?.icon}
              {ROLES.find(r => r.id === selectedRole)?.label}
            </div>
          </div>
          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-sub">Fill in your details to join EduSpark</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Full name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <div className="form-input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="reg-name"
                type="text"
                name="name"
                className={`form-input ${fieldErrors.name ? 'error' : ''}`}
                placeholder="Arjun Sharma"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            {fieldErrors.name && <span className="form-error">⚠ {fieldErrors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <div className="form-input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                id="reg-email"
                type="email"
                name="email"
                className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            {fieldErrors.email && <span className="form-error">⚠ {fieldErrors.email}</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-phone">Mobile Number</label>
            <div className="form-input-wrapper">
              <span className="input-icon phone-prefix">+91</span>
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                className={`form-input phone-input ${fieldErrors.phone ? 'error' : ''}`}
                placeholder="9876543210"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                required
              />
            </div>
            {fieldErrors.phone && <span className="form-error">⚠ {fieldErrors.phone}</span>}
          </div>

          {/* Password row */}
          <div className="auth-two-col">
            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="form-input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                  placeholder="Min 6 chars"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span className="input-icon-right" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? '🙈' : '👁'}
                </span>
              </div>
              {fieldErrors.password && <span className="form-error">⚠ {fieldErrors.password}</span>}
            </div>

            {/* Confirm password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <div className="form-input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span className="input-icon-right" onClick={() => setShowConfirm((v) => !v)}>
                  {showConfirm ? '🙈' : '👁'}
                </span>
              </div>
              {fieldErrors.confirmPassword && <span className="form-error">⚠ {fieldErrors.confirmPassword}</span>}
            </div>
          </div>

          {/* Terms */}
          <p className="auth-terms">
            By creating an account you agree to our{' '}
            <Link to="/terms" className="auth-link">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="auth-link">Privacy Policy</Link>.
          </p>

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-form-footer">
          <span className="text-muted">Already have an account?</span>
          <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
