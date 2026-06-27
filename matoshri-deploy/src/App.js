import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import Landing from './pages/Landing';
import VisitorForm from './pages/VisitorForm';
import VisitorThankYou from './pages/VisitorThankYou';
import BhojanSeva from './pages/BhojanSeva';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function ProtectedRoute({ children, session }) {
  if (!session) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8f4ef' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'inherit', fontSize: 14 } }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<VisitorForm />} />
        <Route path="/thank-you" element={<VisitorThankYou />} />
        <Route path="/bhojan-seva" element={<BhojanSeva />} />
        <Route path="/admin/login" element={<AdminLogin session={session} />} />
        <Route path="/admin/*" element={
          <ProtectedRoute session={session}>
            <AdminDashboard session={session} />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
