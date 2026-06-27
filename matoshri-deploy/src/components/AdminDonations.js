import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { supabase, ORG } from '../lib/supabase';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const STATUS_OPTS = ['Pending','Payment Received','Receipt Generated','Completed','Cancelled'];
const STATUS_BADGE = {
  'Pending': 'badge-warning',
  'Payment Received': 'badge-info',
  'Receipt Generated': 'badge-success',
  'Completed': 'badge-success',
  'Cancelled': 'badge-danger',
};

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const PER_PAGE = 20;

  const fetch = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('donations').select('*').order('created_at', { ascending: false });
    if (filterStatus) q = q.eq('payment_status', filterStatus);
    const { data, error } = await q;
    if (error) toast.error('Failed to load donations');
    else {
      const filtered = search ? data.filter(d =>
        d.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.mobile?.includes(search) ||
        d.donation_id?.includes(search)
      ) : data;
      setDonations(filtered || []);
    }
    setLoading(false);
  }, [search, filterStatus]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('donations').update({ payment_status: status }).eq('id', id);
    if (error) toast.error('Update failed');
    else { toast.success('Status updated'); fetch(); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete donation from "${name}"?`)) return;
    const { error } = await supabase.from('donations').delete().eq('id', id);
    if (error) toast.error('Delete failed');
    else { toast.success('Deleted'); fetch(); }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(donations.map(d => ({
      'Donation ID': d.donation_id, 'Name': d.full_name, 'Mobile': d.mobile,
      'Amount': d.donation_amount, 'Occasion': d.occasion,
      'Preferred Date': d.preferred_date, 'Status': d.payment_status,
      'PAN': d.pan_number, 'Aadhaar': d.aadhaar_number,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Donations');
    XLSX.writeFile(wb, `donations-${Date.now()}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text('Matoshri Anandashram — Bhojan Seva Donations', 14, 16);
    doc.autoTable({
      startY: 28,
      head: [['ID', 'Name', 'Mobile', 'Amount', 'Occasion', 'Date', 'Status']],
      body: donations.map(d => [d.donation_id, d.full_name, d.mobile, `₹${d.donation_amount}`, d.occasion, d.preferred_date, d.payment_status]),
      styles: { fontSize: 7 }, headStyles: { fillColor: [139, 26, 26] }
    });
    doc.save(`donations-${Date.now()}.pdf`);
  };

  const paginated = donations.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(donations.length / PER_PAGE);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.4rem' }}>Bhojan Seva Donations</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>{donations.length} total records</div>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={exportExcel}>📊 Excel</button>
          <button className="btn btn-ghost btn-sm" onClick={exportPDF}>🖨 PDF</button>
          <button className="btn btn-primary btn-sm" onClick={fetch}>↻ Refresh</button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <input className="form-input" placeholder="Search name, mobile, ID..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }} />
          <select className="form-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0); }}>
            <option value="">All Statuses</option>
            {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setFilterStatus(''); }}>Clear</button>
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
                  <th>Donation ID</th><th>Name</th><th>Mobile</th><th>Amount</th>
                  <th>Occasion</th><th>Bhojan Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No records found</td></tr>
                ) : paginated.map(d => (
                  <tr key={d.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: '.8rem' }}>{d.donation_id}</span></td>
                    <td style={{ fontWeight: 500 }}>{d.full_name}</td>
                    <td>{d.mobile}</td>
                    <td style={{ fontWeight: 600, color: 'var(--green)' }}>₹{d.donation_amount?.toLocaleString('en-IN')}</td>
                    <td style={{ fontSize: '.82rem' }}>{d.occasion}</td>
                    <td style={{ fontSize: '.82rem' }}>{d.preferred_date}</td>
                    <td>
                      <select className={`badge ${STATUS_BADGE[d.payment_status] || 'badge-secondary'}`}
                        style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '.25rem .5rem', borderRadius: '20px', fontSize: '.75rem', fontWeight: 500 }}
                        value={d.payment_status}
                        onChange={e => updateStatus(d.id, e.target.value)}>
                        {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '.4rem' }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '.3rem .6rem', fontSize: '.8rem' }}
                          onClick={() => setSelected(d)}>
                          👁 View
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '.3rem .5rem' }}
                          onClick={() => window.open(`https://wa.me/91${d.mobile}`, '_blank')}>💬</button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '.3rem .5rem', color: 'var(--maroon)', borderColor: 'var(--maroon)' }}
                          onClick={() => handleDelete(d.id, d.full_name)}>🗑</button>
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

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.1rem' }}>{selected.full_name}</h3>
                <div style={{ fontFamily: 'monospace', fontSize: '.82rem', color: 'var(--text-muted)' }}>{selected.donation_id}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  ['Mobile', selected.mobile], ['WhatsApp', selected.whatsapp],
                  ['Email', selected.email || '—'], ['Profession', selected.profession],
                  ['Donation Amount', `₹${selected.donation_amount?.toLocaleString('en-IN')}`],
                  ['Occasion', selected.occasion], ['Bhojan Date', selected.preferred_date],
                  ['PAN', selected.pan_number], ['Aadhaar', selected.aadhaar_number],
                  ['Driving Licence', selected.driving_licence], ['Payment Status', selected.payment_status],
                  ['Receipt Status', selected.receipt_status || '—'],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</div>
                    <div style={{ fontWeight: 500, fontSize: '.9rem', marginTop: '.15rem' }}>{v}</div>
                  </div>
                ))}
              </div>
              {selected.address && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.25rem' }}>Address</div>
                  <div style={{ fontSize: '.9rem' }}>{selected.address}</div>
                </div>
              )}
              {selected.special_message && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--saffron-light)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--saffron)' }}>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginBottom: '.3rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Special Message</div>
                  <div style={{ fontSize: '.9rem', fontStyle: 'italic' }}>{selected.special_message}</div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm"
                onClick={() => window.open(`https://wa.me/91${selected.mobile}`, '_blank')}>
                💬 WhatsApp
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
