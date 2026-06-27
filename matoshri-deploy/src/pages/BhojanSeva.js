import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase, ORG } from '../lib/supabase';

const OCCASIONS = ['Birthday','Anniversary','In Memory Of','Festival','General Donation','Other'];

function generateDonationId() {
  const d = new Date();
  const seq = String(Math.floor(Math.random() * 900000) + 100000).padStart(6, '0');
  return `BS-${d.getFullYear()}-${seq}`;
}

export default function BhojanSeva() {
  const [loading, setLoading] = useState(false);
  const [sameWA, setSameWA] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [form, setForm] = useState({
    full_name: '', mobile: '', whatsapp: '', email: '', date_of_birth: '',
    profession: '', address: '', reference: '',
    donation_amount: '7500', occasion: '', preferred_date: '', special_message: '',
    pan_number: '', aadhaar_number: '', driving_licence: '', declaration: false,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    if (!form.mobile.match(/^[6-9]\d{9}$/)) e.mobile = 'Enter valid 10-digit mobile number';
    if (!form.date_of_birth) e.date_of_birth = 'Date of birth is required';
    if (!form.profession.trim()) e.profession = 'Profession is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.donation_amount || Number(form.donation_amount) < 1) e.donation_amount = 'Enter valid amount';
    if (!form.occasion) e.occasion = 'Please select occasion';
    if (!form.preferred_date) e.preferred_date = 'Preferred date is required';
    if (!form.pan_number.trim()) e.pan_number = 'PAN number is required';
    if (!form.aadhaar_number.match(/^\d{12}$/)) e.aadhaar_number = 'Enter valid 12-digit Aadhaar number';
    if (!form.driving_licence.trim()) e.driving_licence = 'Driving licence number is required';
    if (!form.declaration) e.declaration = 'Please confirm the declaration to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setLoading(true);
    try {
      const donation_id = generateDonationId();
      const whatsapp = sameWA ? form.mobile : form.whatsapp;
      const payload = {
        ...form,
        donation_id,
        whatsapp,
        donation_amount: Number(form.donation_amount),
        payment_status: 'Pending',
        receipt_status: 'Not Generated',
      };
      const { error } = await supabase.from('donations').insert([payload]);
      if (error) throw error;
      toast.success('Donation request submitted!');
      setSubmitted({ donation_id, whatsapp, name: form.full_name });
      openWhatsApp({ ...payload, donation_id, whatsapp });
    } catch (err) {
      toast.error('Submission failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (data) => {
    const msg = encodeURIComponent(
`Hello,

I would like to sponsor Bhojan Seva.

Donation Request ID: ${data.donation_id}
Name: ${data.full_name}
Mobile: ${data.mobile}
WhatsApp: ${data.whatsapp}
Email: ${data.email || 'N/A'}
Profession: ${data.profession}
Address: ${data.address}

Donation Amount: ₹${data.donation_amount}
Occasion: ${data.occasion}
Preferred Bhojan Seva Date: ${data.preferred_date}

PAN: ${data.pan_number}
Aadhaar: ${data.aadhaar_number}
Driving Licence: ${data.driving_licence}

Special Message: ${data.special_message || 'None'}

Please share the payment details.

Thank you.`);
    window.open(`https://wa.me/${ORG.whatsapp}?text=${msg}`, '_blank');
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>
        <div className="card" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍛</div>
          <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.8rem', color: 'var(--maroon)', marginBottom: '1rem' }}>
            Donation Request Submitted!
          </h1>
          <p style={{ color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Thank you {submitted.name} for your generosity. Your request has been received and WhatsApp has been opened to connect with us. 🙏
          </p>
          <div style={{ background: 'var(--saffron-light)', border: '1.5px solid var(--saffron)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.25rem' }}>Donation Request ID</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 700, color: 'var(--maroon)', letterSpacing: '.05em' }}>{submitted.donation_id}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            <button className="btn btn-green btn-block" onClick={() => openWhatsApp({ ...form, donation_id: submitted.donation_id, whatsapp: submitted.whatsapp })}>
              💬 Continue on WhatsApp
            </button>
            <Link to="/" className="btn btn-ghost btn-block">🏠 Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const Field = ({ label, name, required, children, hint }) => (
    <div className="form-group">
      <label className="form-label">{label}{required && <span className="req"> *</span>}</label>
      {children}
      {hint && <div className="form-hint">{hint}</div>}
      {errors[name] && <div className="form-error">{errors[name]}</div>}
    </div>
  );

  return (
    <div>
      <nav className="top-nav">
        <div className="container nav-inner">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">🙏</div>
            <div>
              <div className="nav-logo-text">Matoshri Anandashram</div>
              <div className="nav-logo-sub">Old Age Home · Jalgaon</div>
            </div>
          </Link>
          <Link to="/" className="btn btn-ghost btn-sm">← Back</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #8B1A1A 0%, #C4651A 100%)', color: '#fff', padding: '3.5rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍛</div>
          <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: '#fff', marginBottom: '.75rem' }}>
            Sponsor One Day Lunch for Our Elderly Residents
          </h1>
          <p style={{ color: 'rgba(255,255,255,.82)', marginBottom: '1.5rem' }}>
            Your generosity feeds body and soul. One act of kindness touches many lives.
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.15)', borderRadius: '16px', padding: '1rem 2rem' }}>
            <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.7)', marginBottom: '.25rem' }}>One Day Lunch Cost</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Playfair Display,serif', color: '#fff' }}>₹7,500</div>
          </div>
        </div>
      </section>

      <div className="container-sm" style={{ padding: '2.5rem 1.25rem' }}>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontFamily: 'Playfair Display,serif', marginBottom: '1.25rem' }}>Donor Details</h3>

            <div className="form-grid">
              <Field label="Full Name" name="full_name" required>
                <input className="form-input" placeholder="Your full name" value={form.full_name}
                  onChange={e => set('full_name', e.target.value)} />
              </Field>
              <Field label="Mobile Number" name="mobile" required>
                <input className="form-input" placeholder="10-digit mobile" value={form.mobile}
                  onChange={e => set('mobile', e.target.value)} maxLength={10} />
              </Field>
            </div>

            <div className="form-group">
              <label className="checkbox-row" style={{ marginBottom: '.75rem' }}>
                <input type="checkbox" checked={sameWA} onChange={e => setSameWA(e.target.checked)} />
                <span>WhatsApp number same as mobile</span>
              </label>
              {!sameWA && (
                <Field label="WhatsApp Number" name="whatsapp">
                  <input className="form-input" placeholder="WhatsApp number" value={form.whatsapp}
                    onChange={e => set('whatsapp', e.target.value)} maxLength={10} />
                </Field>
              )}
            </div>

            <div className="form-grid">
              <Field label="Email" name="email">
                <input className="form-input" type="email" placeholder="email@example.com" value={form.email}
                  onChange={e => set('email', e.target.value)} />
              </Field>
              <Field label="Date of Birth" name="date_of_birth" required>
                <input className="form-input" type="date" value={form.date_of_birth}
                  onChange={e => set('date_of_birth', e.target.value)}
                  max={new Date().toISOString().split('T')[0]} />
              </Field>
            </div>

            <div className="form-grid">
              <Field label="Profession" name="profession" required>
                <input className="form-input" placeholder="e.g. Doctor, Business" value={form.profession}
                  onChange={e => set('profession', e.target.value)} />
              </Field>
              <Field label="Reference" name="reference">
                <input className="form-input" placeholder="How did you hear about us?" value={form.reference}
                  onChange={e => set('reference', e.target.value)} />
              </Field>
            </div>

            <Field label="Full Address" name="address" required>
              <textarea className="form-input form-textarea" placeholder="House/Flat No., Street, City, State, PIN"
                value={form.address} onChange={e => set('address', e.target.value)} />
            </Field>

            <hr className="divider" />
            <h3 style={{ fontFamily: 'Playfair Display,serif', marginBottom: '1.25rem' }}>Donation Details</h3>

            <div className="form-grid">
              <Field label="Donation Amount (₹)" name="donation_amount" required>
                <input className="form-input" type="number" min="1" placeholder="7500" value={form.donation_amount}
                  onChange={e => set('donation_amount', e.target.value)} />
              </Field>
              <Field label="Occasion" name="occasion" required>
                <select className="form-select" value={form.occasion}
                  onChange={e => set('occasion', e.target.value)}>
                  <option value="">— Select —</option>
                  {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Preferred Bhojan Seva Date" name="preferred_date" required>
              <input className="form-input" type="date" value={form.preferred_date}
                onChange={e => set('preferred_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]} />
            </Field>

            <Field label="Special Message" name="special_message">
              <textarea className="form-input form-textarea" placeholder="Any special message for our residents..."
                value={form.special_message} onChange={e => set('special_message', e.target.value)} />
            </Field>

            <hr className="divider" />
            <h3 style={{ fontFamily: 'Playfair Display,serif', marginBottom: '.5rem' }}>Identity Details</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', marginBottom: '1.25rem' }}>
              Required for official records. Document numbers only — no uploads needed.
            </p>

            <div className="form-grid">
              <Field label="PAN Card Number" name="pan_number" required hint="e.g. ABCDE1234F">
                <input className="form-input" placeholder="ABCDE1234F" value={form.pan_number}
                  onChange={e => set('pan_number', e.target.value.toUpperCase())} maxLength={10} />
              </Field>
              <Field label="Aadhaar Number" name="aadhaar_number" required hint="12-digit number">
                <input className="form-input" placeholder="XXXX XXXX XXXX" value={form.aadhaar_number}
                  onChange={e => set('aadhaar_number', e.target.value.replace(/\D/g, ''))} maxLength={12} />
              </Field>
            </div>

            <Field label="Driving Licence Number" name="driving_licence" required>
              <input className="form-input" placeholder="DL number" value={form.driving_licence}
                onChange={e => set('driving_licence', e.target.value.toUpperCase())} />
            </Field>

            <hr className="divider" />

            <div className="form-group">
              <label className="checkbox-row">
                <input type="checkbox" checked={form.declaration}
                  onChange={e => set('declaration', e.target.checked)} />
                <span>I confirm that the information provided is true and correct.</span>
              </label>
              {errors.declaration && <div className="form-error" style={{ marginTop: '.5rem' }}>{errors.declaration}</div>}
            </div>

            <div style={{ background: 'var(--green-light)', border: '1px solid rgba(46,125,82,.2)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.25rem', fontSize: '.88rem', color: 'var(--green)' }}>
              💬 Clicking the button below will save your request and automatically open WhatsApp to confirm payment details with us.
            </div>

            <button type="submit" className="btn btn-green btn-block btn-lg" disabled={loading}>
              {loading ? '⏳ Submitting...' : '💬 Continue on WhatsApp'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
