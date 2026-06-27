import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export default function AdminLogin({ session }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) return <Navigate to="/admin" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error('Invalid email or password');
    } else {
      toast.success('Welcome back!');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--maroon) 0%, #6B1212 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', color: '#fff' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
          <h1 style={{ fontFamily: 'Playfair Display,serif', color: '#fff', fontSize: '1.75rem', marginBottom: '.5rem' }}>
            Matoshri Anandashram
          </h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '.9rem' }}>Admin Portal</p>
        </div>

        <div className="card">
          <h2 style={{ fontFamily: 'Playfair Display,serif', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.3rem' }}>Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="admin@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-maroon btn-block btn-lg" disabled={loading} style={{ marginTop: '.5rem' }}>
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <a href="/" style={{ color: 'var(--text-muted)', fontSize: '.85rem', textDecoration: 'none' }}>← Back to Website</a>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,.5)', fontSize: '.8rem' }}>
          Authorised access only
        </div>
      </div>
    </div>
  );
}
