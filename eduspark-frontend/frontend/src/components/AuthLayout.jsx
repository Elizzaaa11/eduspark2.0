import React from 'react';
import './AuthLayout.css';

const CATEGORIES = [
  { icon: '♟', label: 'Chess', color: '#FFD700' },
  { icon: '💃', label: 'Dance', color: '#FF6B9D' },
  { icon: '🎨', label: 'Art', color: '#FF6B35' },
  { icon: '🎤', label: 'Speaking', color: '#00D2FF' },
];

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-root">
      {/* ── Left panel (branding) ── */}
      <div className="auth-panel-left">
        {/* Animated background blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="auth-brand">
          {/* Logo */}
          <div className="auth-logo">
            <span className="logo-spark">⚡</span>
            <span className="logo-text">EduSpark</span>
          </div>

          <h1 className="auth-hero-title">
            Ignite Your Child's{' '}
            <span className="gradient-text">Potential</span>
          </h1>

          <p className="auth-hero-sub">
            India's extracurricular learning platform — online 1-on-1 and offline
            at centres near you.
          </p>

          {/* Category pills */}
          <div className="auth-categories">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="auth-cat-pill"
                style={{ '--cat-color': cat.color }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="auth-stats">
            <div className="auth-stat">
              <span className="stat-value">10K+</span>
              <span className="stat-label">Active Learners</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="stat-value">500+</span>
              <span className="stat-label">Expert Mentors</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="stat-value">50+</span>
              <span className="stat-label">Cities</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="auth-panel-right">
        <div className="auth-form-wrapper animate-fadeInUp">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
