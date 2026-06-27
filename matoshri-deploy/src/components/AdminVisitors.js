import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterReason, setFilterReason] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [editRow, setEditRow] = useState(null);
  const [page, setPage] = useState(0);
  const PER_PAGE = 20;

  const fetch = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('visitors').select('*').order('created_at', { ascending: false });
    if (filterDate) q = q.eq('visit_date', filterDate);
    if (filterReason) q = q.eq('reason_for_visit', filterReason);
    const { data, error } = await q;
    if (error) toast.error('Failed to load visitors');
    else {
      const filtered = search ? data.filter(v =>
        v.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        v.mobile?.includes(search) ||
        v.visitor_id?.includes(search)
      ) : data;
      setVisitors(filtered || []);
    }
    setLoading(false);
  }, [search, filterReason, filterDate]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete visitor record for "${name}"?`)) return;
    const { error } = await supabase.from('visitors').delete().eq('id', id);
    if (error) toast.error('Delete failed');
    else { toast.success('Record deleted'); fetch(); }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(visitors.map(v => ({
      'Visitor ID': v.visitor_id, 'Name': v.full_name, 'Mobile': v.mobile,
      'WhatsApp': v.whatsapp, 'Email': v.email, 'Profession': v.profession,
      'Reason': v.reason_for_visit, 'Address': v.address, 'Reference': v.reference,
      'Visit Date': v.visit_date, 'Visit Time': v.visit_time,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Visitors');
    XLSX.writeFile(wb, `matoshri-visitors-${Date.now()}.xlsx`);
  };

  const exportCSV = () => {
    const headers = ['Visitor ID,Name,Mobile,WhatsApp,Email,Profession,Reason,Address,Visit Date'];
    const rows = visitors.map(v => `${v.visitor_id},${v.full_name},${v.mobile},${v.whatsapp || ''},${v.email || ''},${v.profession},"${v.reason_for_visit}","${v.address}",${v.visit_date}`);
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `visitors-${Date.now()}.csv`; a.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text('Matoshri Anandashram — Visitor Records', 14, 16);
    doc.setFontSize(10); doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 23);
    doc.autoTable({
      startY: 28, head: [['ID', 'Name', 'Mobile', 'Reason', 'Date']],
      body: visitors.map(v => [v.visitor_id, v.full_name, v.mobile, v.reason_for_visit, v.visit_date]),
      styles: { fontSize: 8 }, headStyles: { fillColor: [139, 26, 26] }
    });
    doc.save(`visitors-${Date.now()}.pdf`);
  };

  const paginated = visitors.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(visitors.length / PER_PAGE);

  const REASONS = ['General Visit','Bhojan Seva','Birthday Celebration','Anniversary Celebration',
    'Festival Celebration','Donation','Volunteer Service','Medical Camp',
    'School Visit','College Visit','Corporate Visit','NGO Visit','Meet Residents','Other'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.4rem' }}>Visitor Records</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>{visitors.length} total records</div>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={exportExcel}>📊 Excel</button>
          <button className="btn btn-ghost btn-sm" onClick={exportCSV}>📄 CSV</button>
          <button className="btn btn-ghost btn-sm" onClick={exportPDF}>🖨 PDF</button>
          <button className="btn btn-primary btn-sm" onClick={fetch}>↻ Refresh</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <input className="form-input" placeholder="Search name, mobile, ID..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }} />
          <select className="form-select" value={filterReason} onChange={e => { setFilterReason(e.target.value); setPage(0); }}>
            <option value="">All Reasons</option>
            {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input className="form-input" type="date" value={filterDate}
            onChange={e => { setFilterDate(e.target.value); setPage(0); }} />
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setFilterReason(''); setFilterDate(''); }}>
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: 200 }}><div className="spinner" /></div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Visitor ID</th><th>Name</th><th>Mobile</th><th>WhatsApp</th>
                  <th>Email</th><th>Profession</th><th>Reason</th>
                  <th>Date</th><th>Time</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No records found</td></tr>
                ) : paginated.map(v => (
                  <tr key={v.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: '.8rem' }}>{v.visitor_id}</span></td>
                    <td style={{ fontWeight: 500 }}>{v.full_name}</td>
                    <td>{v.mobile}</td>
                    <td>{v.whatsapp || '—'}</td>
                    <td style={{ fontSize: '.82rem' }}>{v.email || '—'}</td>
                    <td>{v.profession}</td>
                    <td><span className="badge badge-info" style={{ fontSize: '.75rem' }}>{v.reason_for_visit}</span></td>
                    <td style={{ fontSize: '.82rem' }}>{v.visit_date}</td>
                    <td style={{ fontSize: '.82rem' }}>{v.visit_time?.slice(0,5)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '.4rem' }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '.3rem .5rem' }}
                          onClick={() => window.open(`https://wa.me/91${v.mobile}`, '_blank')}>💬</button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '.3rem .5rem', color: 'var(--maroon)', borderColor: 'var(--maroon)' }}
                          onClick={() => handleDelete(v.id, v.full_name)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1rem' }}>
              <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ padding: '.5rem 1rem', fontSize: '.88rem', color: 'var(--text-muted)' }}>Page {page + 1} of {totalPages}</span>
              <button className="btn btn-ghost btn-sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
