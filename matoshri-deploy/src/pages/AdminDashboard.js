import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import AdminOverview from '../components/AdminOverview';
import AdminVisitors from '../components/AdminVisitors';
import AdminDonations from '../components/AdminDonations';
import AdminReceipts from '../components/AdminReceipts';

const SidebarIcon = ({ path }) => {
  const icons = {
    '/admin': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    ),
    '/admin/visitors': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    '/admin/donations': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
    ),
    '/admin/receipts': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    ),
  };
  return icons[path] || null;
};

export default function AdminDashboard({ session }) {
  const nav = useNavigate();
  const loc = useLocation();
  const [mobileNav, setMobileNav] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
    nav('/admin/login');
  };

  const NAV = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/visitors', label: 'Visitors' },
    { path: '/admin/donations', label: 'Donations' },
    { path: '/admin/receipts', label: 'Receipts' },
  ];

  const isActive = (path) => path === '/admin' ? loc.pathname === '/admin' : loc.pathname.startsWith(path);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>🙏</div>
          <div className="sidebar-brand-name">Matoshri Anandashram</div>
          <div className="sidebar-brand-sub">Admin Panel</div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">Main Menu</div>
          {NAV.map(n => (
            <button key={n.path} className={`sidebar-link${isActive(n.path) ? ' active' : ''}`}
              onClick={() => { nav(n.path); setMobileNav(false); }}>
              <SidebarIcon path={n.path} />
              {n.label}
            </button>
          ))}
          <div className="sidebar-section" style={{ marginTop: '1.5rem' }}>Quick Links</div>
          <a href="/" target="_blank" rel="noreferrer" className="sidebar-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            View Website
          </a>
          <a href="/register" target="_blank" rel="noreferrer" className="sidebar-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Visitor Form
          </a>
        </nav>

        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.5)', marginBottom: '.5rem' }}>
            {session?.user?.email}
          </div>
          <button className="btn btn-ghost btn-sm btn-block" onClick={handleLogout}
            style={{ color: 'rgba(255,255,255,.8)', borderColor: 'rgba(255,255,255,.2)' }}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
              {NAV.find(n => isActive(n.path))?.label || 'Admin'}
            </span>
          </div>
          <div style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <div className="admin-content">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="visitors" element={<AdminVisitors />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="receipts" element={<AdminReceipts />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
