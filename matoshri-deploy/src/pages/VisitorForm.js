import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const REASONS = [
  'General Visit','Bhojan Seva','Birthday Celebration','Anniversary Celebration',
  'Festival Celebration','Donation','Volunteer Service','Medical Camp',
  'School Visit','College Visit','Corporate Visit','NGO Visit','Meet Residents','Other'
];

function generateVisitorId() {
  const d = new Date();
  const yr = d.getFullYear();
  const rand = Math.floor(Math.random() * 900000) + 100000;
  return `VIS-${yr}-${rand}`;
}

export default function VisitorForm() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sameWA, setSameWA] = useState(true);
  const [volunteer, setVolunteer] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    full_name: '', mobile: '', whatsapp: '', email: '', date_of_birth: '',
    profession: '', address: '', reference: '', reason_for_visit: '',
    consent: false, volunteer_date: '', volunteer_time: '', volunteer_skills: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    if (!form.mobile.match(/^[6-9]\d{9}$/)) e.mobile = 'Enter valid 10-digit mobile number';
    if (!form.date_of_birth) e.date_of_birth = 'Date of birth is required';
    if (!form.profession.trim()) e.profession = 'Profession is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.reason_for_visit) e.reason_for_visit = 'Please select reason for visit';
    if (!form.consent) e.consent = 'You must agree to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const visitor_id = generateVisitorId();
      const whatsapp = sameWA ? form.mobile : form.whatsapp;
      const payload = {
        ...form,
        visitor_id,
        whatsapp,
        visit_date: new Date().toISOString().split('T')[0],
        visit_time: new Date().toTimeString().split(' ')[0],
        device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        browser: navigator.userAgent.split(' ').pop(),
        volunteer_interest: volunteer,
      };
      const { error } = await supabase.from('visitors').insert([payload]);
      if (error) throw error;
      toast.success('Visitor registered successfully!');
      nav('/thank-you', { state: { visitor_id, name: form.full_name, reason: form.reason_for_visit } });
    } catch (err) {
      toast.error('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

      <section className="page-header">
        <div className="container">
          <h1>Register Your Visit</h1>
          <p>Please fill in your details to record your visit</p>
        </div>
      </section>

      <div className="container-sm" style={{ padding: '2.5rem 1.25rem' }}>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontFamily: 'Playfair Display,serif', marginBottom: '1.25rem', color: 'var(--text-dark)' }}>Personal Details</h3>

            <div className="form-grid">
              <Field label="Full Name" name="full_name" required>
                <input className="form-input" placeholder="Your full name" value={form.full_name}
                  onChange={e => set('full_name', e.target.value)} />
              </Field>
              <Field label="Mobile Number" name="mobile" required>
                <input className="form-input" placeholder="10-digit mobile number" value={form.mobile}
                  onChange={e => set('mobile', e.target.value)} maxLength={10} />
              </Field>
            </div>

            <div className="form-group">
              <label className="checkbox-row" style={{ marginBottom: '.75rem' }}>
                <input type="checkbox" checked={sameWA} onChange={e => setSameWA(e.target.checked)} />
                <span>My WhatsApp number is the same as my mobile number</span>
              </label>
              {!sameWA && (
                <Field label="WhatsApp Number" name="whatsapp">
                  <input className="form-input" placeholder="WhatsApp number" value={form.whatsapp}
                    onChange={e => set('whatsapp', e.target.value)} maxLength={10} />
                </Field>
              )}
            </div>

            <div className="form-grid">
              <Field label="Email Address" name="email">
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
                <input className="form-input" placeholder="e.g. Teacher, Doctor, Business" value={form.profession}
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

            <Field label="Reason for Visit" name="reason_for_visit" required>
              <select className="form-select" value={form.reason_for_visit}
                onChange={e => set('reason_for_visit', e.target.value)}>
                <option value="">— Select reason —</option>
                {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>

            <hr className="divider" />
            <h3 style={{ fontFamily: 'Playfair Display,serif', marginBottom: '1.25rem', color: 'var(--text-dark)' }}>Volunteer Interest</h3>

            <div className="form-group">
              <label className="checkbox-row" style={{ marginBottom: '.75rem' }}>
                <input type="checkbox" checked={volunteer} onChange={e => setVolunteer(e.target.checked)} />
                <span>I am interested in volunteering at Matoshri Anandashram</span>
              </label>
              {volunteer && (
                <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'var(--green-light)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(46,125,82,.2)' }}>
                  <div className="form-grid">
                    <Field label="Preferred Date">
                      <input className="form-input" type="date" value={form.volunteer_date}
                        onChange={e => set('volunteer_date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]} />
                    </Field>
                    <Field label="Preferred Time">
                      <select className="form-select" value={form.volunteer_time}
                        onChange={e => set('volunteer_time', e.target.value)}>
                        <option value="">— Select —</option>
                        <option>Morning (9 AM – 12 PM)</option>
                        <option>Afternoon (12 PM – 4 PM)</option>
                        <option>Evening (4 PM – 7 PM)</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Your Skills / What you'd like to contribute">
                    <input className="form-input" placeholder="e.g. Teaching, Medical, Music, Cooking..." value={form.volunteer_skills}
                      onChange={e => set('volunteer_skills', e.target.value)} />
                  </Field>
                </div>
              )}
            </div>

            <hr className="divider" />

            <div className="form-group">
              <label className="checkbox-row">
                <input type="checkbox" checked={form.consent}
                  onChange={e => set('consent', e.target.checked)} />
                <span>I agree that my information may be stored for visitor records and future communication.</span>
              </label>
              {errors.consent && <div className="form-error" style={{ marginTop: '.5rem' }}>{errors.consent}</div>}
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: '1rem' }}>
              {loading ? '⏳ Submitting...' : '✅ Register My Visit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
