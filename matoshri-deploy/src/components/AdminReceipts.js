import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { supabase, ORG } from '../lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function generateReceiptNumber() {
  const d = new Date();
  return `RCPT-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 90000) + 10000}`;
}

export default function AdminReceipts() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .in('payment_status', ['Payment Received', 'Receipt Generated', 'Completed'])
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load');
    else setDonations(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const generateReceipt = async (donation) => {
    const receipt_number = donation.receipt_number || generateReceiptNumber();
    const receipt_date = new Date().toISOString().split('T')[0];

    // Save receipt number if not set
    if (!donation.receipt_number) {
      await supabase.from('donations').update({
        receipt_number,
        receipt_status: 'Generated',
        payment_status: 'Receipt Generated',
      }).eq('id', donation.id);
    }

    // Generate PDF
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(139, 26, 26);
    doc.rect(0, 0, pageW, 40, 'F');
    doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('Matoshri Anandashram', pageW / 2, 16, { align: 'center' });
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text('Savkheda Shivar, Tal & Dist. Jalgaon, Maharashtra', pageW / 2, 24, { align: 'center' });
    doc.text('Ph: 0257 2281327 | 9423574806', pageW / 2, 31, { align: 'center' });

    // Receipt title
    doc.setTextColor(139, 26, 26);
    doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('BHOJAN SEVA DONATION RECEIPT', pageW / 2, 52, { align: 'center' });

    // Divider
    doc.setDrawColor(139, 26, 26); doc.setLineWidth(0.5);
    doc.line(14, 57, pageW - 14, 57);

    // Receipt meta
    doc.setTextColor(60, 40, 20); doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text(`Receipt No: ${receipt_number}`, 14, 65);
    doc.text(`Donation ID: ${donation.donation_id}`, 14, 72);
    doc.text(`Receipt Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageW - 14, 65, { align: 'right' });
    doc.text(`Payment Status: ${donation.payment_status}`, pageW - 14, 72, { align: 'right' });

    // Donor details table
    doc.autoTable({
      startY: 80,
      head: [['Donor Details', '']],
      body: [
        ['Full Name', donation.full_name],
        ['Mobile', donation.mobile],
        ['WhatsApp', donation.whatsapp || donation.mobile],
        ['Email', donation.email || 'N/A'],
        ['Profession', donation.profession],
        ['Address', donation.address],
      ],
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [232, 131, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50, fillColor: [253, 240, 227] } },
    });

    // Donation details table
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 8,
      head: [['Donation Details', '']],
      body: [
        ['Donation Amount', `Rs. ${donation.donation_amount?.toLocaleString('en-IN')}/-`],
        ['Purpose', 'Bhojan Seva'],
        ['Occasion', donation.occasion],
        ['Preferred Bhojan Seva Date', donation.preferred_date ? new Date(donation.preferred_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
        ['Special Message', donation.special_message || 'None'],
      ],
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [139, 26, 26], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50, fillColor: [253, 242, 242] } },
    });

    const finalY = doc.lastAutoTable.finalY + 20;

    // Amount box
    doc.setFillColor(253, 240, 227);
    doc.rect(14, finalY - 5, pageW - 28, 22, 'F');
    doc.setDrawColor(232, 131, 42); doc.rect(14, finalY - 5, pageW - 28, 22, 'S');
    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(139, 26, 26);
    doc.text(`Total Amount: Rs. ${donation.donation_amount?.toLocaleString('en-IN')}/-`, pageW / 2, finalY + 8, { align: 'center' });

    // Signature area
    const sigY = finalY + 35;
    doc.setDrawColor(180, 160, 140);
    doc.line(14, sigY + 15, 80, sigY + 15);
    doc.line(pageW - 80, sigY + 15, pageW - 14, sigY + 15);
    doc.setFontSize(8); doc.setTextColor(120, 100, 80); doc.setFont('helvetica', 'normal');
    doc.text('Donor Signature', 14, sigY + 20);
    doc.text('Authorised Signatory', pageW - 14, sigY + 20, { align: 'right' });

    // Stamp placeholder
    doc.setDrawColor(139, 26, 26); doc.setLineDash([2, 2]);
    doc.circle(pageW - 35, sigY - 5, 20, 'S');
    doc.setFontSize(7); doc.setTextColor(139, 26, 26);
    doc.text('OFFICIAL', pageW - 35, sigY - 7, { align: 'center' });
    doc.text('STAMP', pageW - 35, sigY - 1, { align: 'center' });

    // Footer
    doc.setLineDash([]);
    doc.setFillColor(139, 26, 26);
    doc.rect(0, doc.internal.pageSize.getHeight() - 20, pageW, 20, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'italic'); doc.setTextColor(255, 255, 255);
    doc.text('"Thank you for supporting our elderly residents with love and compassion. 🙏"', pageW / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });

    toast.success(`Receipt ${receipt_number} generated!`);
    fetch();
    return { doc, receipt_number };
  };

  const downloadReceipt = async (donation) => {
    const result = await generateReceipt(donation);
    if (result) result.doc.save(`Receipt-${result.receipt_number}.pdf`);
  };

  const printReceipt = async (donation) => {
    const result = await generateReceipt(donation);
    if (result) result.doc.autoPrint(); result?.doc?.output('dataurlnewwindow');
  };

  const sendReceiptWhatsApp = async (donation) => {
    const result = await generateReceipt(donation);
    if (!result) return;
    const msg = encodeURIComponent(
`Dear ${donation.full_name},

Your Bhojan Seva donation receipt is ready.

Receipt No: ${result.receipt_number}
Donation ID: ${donation.donation_id}
Amount: Rs. ${donation.donation_amount?.toLocaleString('en-IN')}/-
Occasion: ${donation.occasion}
Bhojan Seva Date: ${donation.preferred_date}
Status: ${donation.payment_status}

Thank you for your generous support to Matoshri Anandashram. 🙏

— Matoshri Anandashram`);
    window.open(`https://wa.me/91${donation.mobile}?text=${msg}`, '_blank');
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.4rem' }}>Receipt Generator</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '.88rem', marginTop: '.25rem' }}>
          Generate receipts for donations with "Payment Received" or higher status.
        </p>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: 200 }}><div className="spinner" /></div>
      ) : donations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📄</div>
          <h3 style={{ fontFamily: 'Playfair Display,serif', marginBottom: '.5rem' }}>No receipts to generate</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Donations with "Payment Received" status will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {donations.map(d => (
            <div key={d.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{d.full_name}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '.8rem', color: 'var(--text-muted)' }}>{d.donation_id}</span>
                    <span className={`badge ${d.payment_status === 'Pending' ? 'badge-warning' : d.payment_status === 'Cancelled' ? 'badge-danger' : 'badge-success'}`}>
                      {d.payment_status}
                    </span>
                    {d.receipt_number && (
                      <span className="badge badge-info" style={{ fontSize: '.72rem' }}>{d.receipt_number}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <span>📱 {d.mobile}</span>
                    <span>💰 ₹{d.donation_amount?.toLocaleString('en-IN')}</span>
                    <span>🎉 {d.occasion}</span>
                    <span>📅 {d.preferred_date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => downloadReceipt(d)}>
                    📥 Download Receipt
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => printReceipt(d)}>
                    🖨 Print
                  </button>
                  <button className="btn btn-green btn-sm" onClick={() => sendReceiptWhatsApp(d)}>
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
