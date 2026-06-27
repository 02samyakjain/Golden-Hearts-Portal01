import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, ORG } from '../lib/supabase';

export default function AdminOverview() {
  const nav = useNavigate();
  const [stats, setStats] = useState({ visitors: 0, todayVisitors: 0, todayDonations: 0, pendingDonations: 0, completedDonations: 0 });
  const [birthdays, setBirthdays] = useState([]);
  const [upcomingBhojan, setUpcomingBhojan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const today = new Date().toISOString().split('T')[0];
    const todayMMDD = today.slice(5);

    const [vAll, vToday, dAll, dToday, dPending, dCompleted, donors] = await Promise.all([
      supabase.from('visitors').select('id', { count: 'exact', head: true }),
      supabase.from('visitors').select('id', { count: 'exact', head: true }).eq('visit_date', today),
      supabase.from('donations').select('id', { count: 'exact', head: true }),
      supabase.from('donations').select('id', { count: 'exact', head: true }).gte('created_at', today),
      supabase.from('donations').select('id', { count: 'exact', head: true }).eq('payment_status', 'Pending'),
      supabase.from('donations').select('id', { count: 'exact', head: true }).eq('payment_status', 'Completed'),
      supabase.from('donations').select('full_name,mobile,preferred_date').gte('preferred_date', today).order('preferred_date').limit(5),
    ]);

    // Birthday check — people with DOB matching today's MM-DD
    const { data: allVisitors } = await supabase.from('visitors').select('full_name,mobile,date_of_birth').not('date_of_birth', 'is', null);
    const todayBirthdays = (allVisitors || []).filter(v => v.date_of_birth?.slice(5) === todayMMDD);

    setStats({
      visitors: vAll.count || 0,
      todayVisitors: vToday.count || 0,
      todayDonations: dToday.count || 0,
      pendingDonations: dPending.count || 0,
      completedDonations: dCompleted.count || 0,
      totalDonations: dAll.count || 0,
    });
    setBirthdays(todayBirthdays);
    setUpcomingBhojan(donors.data || []);
    setLoading(false);
  };

  const sendBirthdayWish = (person) => {
    const msg = encodeURIComponent(`🎂 Happy Birthday ${person.full_name}!\n\nWe at Matoshri Anandashram wish you a very happy birthday filled with joy and good health. 🙏\n\n— Matoshri Anandashram Family`);
    window.open(`https://wa.me/91${person.mobile}?text=${msg}`, '_blank');
  };

  if (loading) return <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>;

  const STAT_CARDS = [
    { num: stats.todayVisitors, label: "Today's Visitors", color: 'var(--saffron)', emoji: '👥' },
    { num: stats.visitors, label: 'Total Visitors', color: 'var(--maroon)', emoji: '📋' },
    { num: stats.pendingDonations, label: 'Pending Donations', color: '#D97706', emoji: '⏳' },
    { num: stats.completedDonations, label: 'Completed Donations', color: 'var(--green)', emoji: '✅' },
    { num: stats.totalDonations, label: 'Total Bhojan Sevas', color: '#7C3AED', emoji: '🍛' },
    { num: stats.todayDonations, label: "Today's Requests", color: '#0891B2', emoji: '📝' },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: 'Playfair Display,serif', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>
        Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 🙏
      </h2>

      {/* Stats */}
      <div className="stats-grid">
        {STAT_CARDS.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '1.5rem', marginBottom: '.25rem' }}>{s.emoji}</div>
            <div className="stat-num" style={{ color: s.color }}>{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Birthdays */}
        <div className="card">
          <h3 style={{ fontFamily: 'Playfair Display,serif', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            🎂 Today's Birthdays
            {birthdays.length > 0 && <span className="badge badge-success">{birthdays.length}</span>}
          </h3>
          {birthdays.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '.88rem' }}>No birthdays today 🎈</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {birthdays.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.75rem', background: 'var(--saffron-light)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{b.full_name}</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{b.mobile}</div>
                  </div>
                  <button className="btn btn-green btn-sm" onClick={() => sendBirthdayWish(b)}>
                    💬 Wish
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Bhojan Seva */}
        <div className="card">
          <h3 style={{ fontFamily: 'Playfair Display,serif', marginBottom: '1rem', fontSize: '1.1rem' }}>
            🍛 Upcoming Bhojan Sevas
          </h3>
          {upcomingBhojan.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '.88rem' }}>No upcoming bookings</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {upcomingBhojan.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.75rem', background: 'var(--saffron-light)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{b.full_name}</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{b.mobile}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--maroon)' }}>
                      {new Date(b.preferred_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-outline btn-sm btn-block" style={{ marginTop: '1rem' }}
            onClick={() => nav('/admin/donations')}>
            View All Donations →
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Playfair Display,serif', marginBottom: '1rem', fontSize: '1.1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => nav('/admin/visitors')}>👥 View Visitors</button>
          <button className="btn btn-maroon" onClick={() => nav('/admin/donations')}>🍛 View Donations</button>
          <button className="btn btn-ghost" onClick={() => nav('/admin/receipts')}>📄 Receipts</button>
          <a href="/register" target="_blank" rel="noreferrer" className="btn btn-ghost">+ New Visit</a>
          <a href="/bhojan-seva" target="_blank" rel="noreferrer" className="btn btn-ghost">+ New Donation</a>
        </div>
      </div>
    </div>
  );
}
