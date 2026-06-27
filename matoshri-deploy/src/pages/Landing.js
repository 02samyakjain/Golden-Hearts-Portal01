import React from 'react';
import { Link } from 'react-router-dom';
import { ORG } from '../lib/supabase';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
];

const GALLERY_ITEMS = [
  { emoji: '🙏', title: 'Prayer & Meditation', desc: 'Daily spiritual gatherings' },
  { emoji: '🍛', title: 'Nutritious Meals', desc: 'Home-cooked with love' },
  { emoji: '🏥', title: 'Medical Care', desc: 'Regular health checkups' },
  { emoji: '🎨', title: 'Activities', desc: 'Art, music & recreation' },
  { emoji: '📚', title: 'Learning', desc: 'Workshops & storytelling' },
  { emoji: '🌿', title: 'Gardens', desc: 'Peaceful green spaces' },
];

export default function Landing() {
  return (
    <div style={{ background: 'var(--cream)' }}>
      {/* Nav */}
      <nav className="top-nav">
        <div className="container nav-inner">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">🙏</div>
            <div>
              <div className="nav-logo-text">Matoshri Anandashram</div>
              <div className="nav-logo-sub">Old Age Home · Jalgaon</div>
            </div>
          </Link>
          <div className="nav-links">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="nav-link hide-mobile">{l.label}</a>
            ))}
            <Link to="/register" className="btn btn-primary btn-sm">Register Visit</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--maroon) 0%, #6B1212 60%, #8B3A1A 100%)',
        color: '#fff', padding: '5rem 0 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .04, fontSize: '8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>🙏</div>
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.12)', borderRadius: '20px', padding: '.35rem 1rem', fontSize: '.85rem', marginBottom: '1.25rem', letterSpacing: '.04em' }}>
            Est. with Love & Compassion
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#fff', marginBottom: '1rem', fontWeight: 700 }}>
            Matoshri Anandashram
          </h1>
          <p style={{ color: 'rgba(255,255,255,.82)', fontSize: '1.1rem', maxWidth: 540, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            A home of warmth, dignity, and care for our beloved elders. Every day, we serve with devotion and gratitude.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-lg" style={{ background: '#fff', color: 'var(--maroon)', fontWeight: 600 }}>
              🧾 Register Your Visit
            </Link>
            <Link to="/bhojan-seva" className="btn btn-lg btn-outline" style={{ borderColor: 'rgba(255,255,255,.6)', color: '#fff' }}>
              🍛 Sponsor Bhojan Seva
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats strip */}
      <section style={{ background: 'var(--saffron)', padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', textAlign: 'center' }}>
            {[
              { n: '50+', l: 'Residents' },
              { n: '₹7,500', l: 'Bhojan Seva / day' },
              { n: '365', l: 'Days of Service' },
              { n: '100%', l: 'Love & Care' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Playfair Display,serif', color: '#fff' }}>{s.n}</div>
                <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.85)', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--saffron)', fontSize: '.85rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '.75rem' }}>About Us</div>
              <h2 className="section-title">A Place Elders Call Home</h2>
              <p style={{ color: 'var(--text-mid)', marginTop: '1rem', lineHeight: 1.8 }}>
                Matoshri Anandashram is a sanctuary of peace, care, and dignity for our elderly residents. Located in the serene surroundings of Savkheda Shivar, Jalgaon, we provide comprehensive care including nutritious meals, medical attention, recreational activities, and spiritual support.
              </p>
              <p style={{ color: 'var(--text-mid)', marginTop: '1rem', lineHeight: 1.8 }}>
                Our Bhojan Seva program allows kind-hearted donors to sponsor a full day's nutritious lunch for all our residents — a meaningful act of service that feeds both body and soul.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary">Register Your Visit</Link>
                <Link to="/bhojan-seva" className="btn btn-outline">Sponsor Bhojan Seva</Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              {[
                { icon: '🙏', t: 'Spiritual Care', d: 'Daily prayers & peace' },
                { icon: '🍛', t: 'Nutritious Food', d: 'Fresh home-cooked meals' },
                { icon: '🏥', t: 'Medical Support', d: 'Regular health checkups' },
                { icon: '❤️', t: 'Loving Environment', d: 'Family-like atmosphere' },
              ].map(f => (
                <div key={f.t} className="card" style={{ textAlign: 'center', padding: '1.25rem 1rem' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '.5rem' }}>{f.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '.9rem', color: 'var(--text-dark)' }}>{f.t}</div>
                  <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>{f.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bhojan Seva */}
      <section style={{ background: 'var(--saffron-light)', padding: '4rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍛</div>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '.75rem' }}>
            Sponsor a Day of Nourishment
          </h2>
          <p style={{ color: 'var(--text-mid)', maxWidth: 500, margin: '0 auto 1rem', lineHeight: 1.7 }}>
            For just <strong style={{ color: 'var(--saffron)', fontSize: '1.1em' }}>₹7,500</strong>, you can sponsor a complete, nutritious lunch for all our elderly residents on your chosen date — on a birthday, anniversary, or any auspicious occasion.
          </p>
          <Link to="/bhojan-seva" className="btn btn-primary btn-lg" style={{ marginTop: '.75rem' }}>
            🍛 Sponsor Bhojan Seva — ₹7,500
          </Link>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="section">
        <div className="container">
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ color: 'var(--saffron)', fontSize: '.85rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '.5rem' }}>Gallery</div>
            <h2 className="section-title">Life at Matoshri Anandashram</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {GALLERY_ITEMS.map(g => (
              <div key={g.title} className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{g.emoji}</div>
                <div style={{ fontWeight: 600, color: 'var(--text-dark)', marginBottom: '.3rem' }}>{g.title}</div>
                <div style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map */}
      <section id="contact" style={{ background: 'var(--maroon-light)', padding: '4rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <div style={{ color: 'var(--saffron)', fontSize: '.85rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '.5rem' }}>Contact Us</div>
              <h2 className="section-title">Get in Touch</h2>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: '📍', label: 'Address', val: 'Savkheda Shivar, Tal & Dist. Jalgaon, Maharashtra' },
                  { icon: '📞', label: 'Phone', val: '0257 2281327 & 9423574806' },
                  { icon: '💬', label: 'WhatsApp', val: '+91 90041 84333' },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.2rem', marginTop: 2 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{c.label}</div>
                      <div style={{ color: 'var(--text-dark)', marginTop: '.15rem' }}>{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary">Register Visit</Link>
                <a href={ORG.mapUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">📍 View on Maps</a>
              </div>
            </div>
            <div>
              <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', height: 280 }}>
                <iframe
                  title="Matoshri Anandashram Location"
                  src="https://maps.google.com/maps?q=Matoshri+Anandashram,+Savkheda,+Jalgaon&output=embed"
                  width="100%" height="280" style={{ border: 0, display: 'block' }}
                  allowFullScreen loading="lazy"
                />
              </div>
              <div style={{ marginTop: '.75rem', textAlign: 'center' }}>
                <a href={ORG.mapUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--saffron)', fontSize: '.85rem', textDecoration: 'none', fontWeight: 500 }}>
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--maroon)', color: 'rgba(255,255,255,.8)', padding: '2rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.1rem', color: '#fff', marginBottom: '.5rem' }}>
            Matoshri Anandashram
          </div>
          <div style={{ fontSize: '.85rem', marginBottom: '1rem' }}>Savkheda Shivar, Jalgaon · 0257 2281327 · 9423574806</div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ color: 'rgba(255,255,255,.8)', textDecoration: 'none', fontSize: '.85rem' }}>Register Visit</Link>
            <Link to="/bhojan-seva" style={{ color: 'rgba(255,255,255,.8)', textDecoration: 'none', fontSize: '.85rem' }}>Bhojan Seva</Link>
            <Link to="/admin/login" style={{ color: 'rgba(255,255,255,.8)', textDecoration: 'none', fontSize: '.85rem' }}>Admin</Link>
          </div>
          <div style={{ marginTop: '1.25rem', fontSize: '.8rem', color: 'rgba(255,255,255,.4)' }}>
            © {new Date().getFullYear()} Matoshri Anandashram. Serving with love.
          </div>
        </div>
      </footer>
    </div>
  );
}


can we change this and make it more proumt apple tesla feel
motion graphics and all
