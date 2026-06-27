import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function VisitorThankYou() {
  const { state } = useLocation();
  const { visitor_id, name, reason } = state || {};

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>
      <div className="card" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❤️</div>
        <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.8rem', color: 'var(--maroon)', marginBottom: '1rem' }}>
          Thank You for Visiting!
        </h1>
        <p style={{ color: 'var(--text-mid)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          {name ? `Dear ${name}, your` : 'Your'} visit has been recorded.<br />
          {reason && <span style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Purpose: {reason}</span>}
        </p>

        {visitor_id && (
          <div style={{ background: 'var(--saffron-light)', border: '1.5px solid var(--saffron)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.25rem' }}>Your Visitor ID</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 700, color: 'var(--maroon)', letterSpacing: '.05em' }}>{visitor_id}</div>
          </div>
        )}

        <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          We are grateful for your time and support. Our elderly residents appreciate every act of kindness. 🙏
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <Link to="/bhojan-seva" className="btn btn-primary btn-block">
            🍛 Sponsor Bhojan Seva — ₹7,500
          </Link>
          <Link to="/" className="btn btn-ghost btn-block">
            🏠 Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
