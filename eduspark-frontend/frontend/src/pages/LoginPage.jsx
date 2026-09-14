import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';
import AuthLayout from '../components/AuthLayout';
import './Auth.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginUser(form);
      const { user, token } = res.data.data;
      login(user, token);

      // Route based on role
      const routes = {
        student: '/student',
        mentor: '/mentor',
        centre: '/centre',
        admin: '/admin',
      };
      navigate(routes[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-container">
        {/* Header */}
        <div className="auth-form-header">
          <div className="auth-form-logo">
            <span>⚡</span>
            <span className="auth-form-logo-text">EduSpark</span>
          </div>
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-sub">Sign in to continue your learning journey</p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="alert alert-error">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email address</label>
            <div className="form-input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                id="login-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="auth-label-row">
              <label className="form-label" htmlFor="login-password">Password</label>
              <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
            </div>
            <div className="form-input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <span
                className="input-icon-right"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Footer link */}
        <div className="auth-form-footer">
          <span className="text-muted">Don't have an account?</span>
          <Link to="/register" className="auth-link">Create account</Link>
        </div>

        {/* Role hint */}
        <div className="auth-role-hint">
          <div className="auth-role-hint-inner">
            <span>🎓 Student</span>
            <span>·</span>
            <span>🧑‍🏫 Mentor</span>
            <span>·</span>
            <span>🏫 Centre</span>
          </div>
          <p>All roles use the same login</p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
