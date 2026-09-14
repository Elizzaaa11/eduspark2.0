import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import './Auth.css';

/*
  NOTE: The backend does NOT yet have a forgot-password endpoint.
  This page is fully wired up and ready — once you add:
    POST /api/auth/forgot-password  → sends reset email
    POST /api/auth/reset-password   → accepts token + new password
  just swap the commented API call below.
*/

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    setError('');

    try {
      // TODO: Uncomment once backend endpoint is ready:
      // await api.post('/auth/forgot-password', { email });

      // Simulating API delay for demo
      await new Promise((res) => setTimeout(res, 1500));
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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

          {!sent ? (
            <>
              <div className="forgot-icon-wrapper">
                <div className="forgot-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    <circle cx="12" cy="16" r="1" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <h2 className="auth-form-title">Forgot Password?</h2>
              <p className="auth-form-sub">
                No worries! Enter your registered email and we'll send you a reset link.
              </p>
            </>
          ) : (
            <>
              <div className="forgot-icon-wrapper">
                <div className="forgot-icon forgot-icon--success">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 2L11 13"/>
                    <path d="M22 2L15 22l-4-9-9-4 20-7z"/>
                  </svg>
                </div>
              </div>
              <h2 className="auth-form-title">Check your inbox</h2>
              <p className="auth-form-sub">
                We've sent a password reset link to <strong style={{ color: 'var(--text)' }}>{email}</strong>.
                Check your spam folder if you don't see it.
              </p>
            </>
          )}
        </div>

        {/* Success state */}
        {sent ? (
          <div className="forgot-success-actions">
            <div className="alert alert-success" style={{ marginBottom: '24px' }}>
              <span>✓</span>
              <span>Reset email sent! Link expires in 30 minutes.</span>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-full"
              onClick={() => { setSent(false); setEmail(''); }}
            >
              Try a different email
            </button>

            <Link to="/login" className="btn btn-primary btn-full" style={{ marginTop: '12px' }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="alert alert-error">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">Email Address</label>
                <div className="form-input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <input
                    id="forgot-email"
                    type="email"
                    className={`form-input ${error ? 'error' : ''}`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                id="forgot-submit-btn"
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : null}
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <div className="auth-form-footer">
              <Link to="/login" className="auth-back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
