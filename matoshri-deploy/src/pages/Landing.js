import React, { useEffect, useRef, useState } from 'react';
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
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorX(e.clientX / window.innerWidth);
      setCursorY(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ 
      background: '#000', 
      color: '#fff', 
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease forwards;
        }
        
        .animate-slide-left {
          animation: slideInLeft 0.8s ease forwards;
        }
        
        .animate-scale {
          animation: scaleIn 0.6s ease forwards;
        }
        
        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.1);
          transform: translateY(-5px) scale(1.02);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientMove 4s ease infinite;
        }
        
        .nav-link-hover {
          position: relative;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .nav-link-hover::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #FFD700, #FFA500);
          transition: width 0.3s ease;
        }
        
        .nav-link-hover:hover {
          color: #FFD700;
        }
        
        .nav-link-hover:hover::after {
          width: 100%;
        }
        
        .glass-effect {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.05);
        }
        
        .btn-primary-custom {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          font-weight: 600;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          border: none;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }
        
        .btn-primary-custom:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 40px rgba(255, 215, 0, 0.3);
        }
        
        .btn-outline-custom {
          background: transparent;
          color: #FFD700;
          font-weight: 500;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          border: 1px solid rgba(255,215,0,0.3);
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }
        
        .btn-outline-custom:hover {
          transform: scale(1.05);
          border-color: #FFD700;
          box-shadow: 0 10px 40px rgba(255, 215, 0, 0.1);
        }
        
        .card-hover {
          transition: all 0.3s ease;
          cursor: default;
        }
        
        .card-hover:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(255,215,0,0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        
        .section-hidden {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }
        
        .section-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .stagger-children > * {
          opacity: 0;
          animation: slideUp 0.8s ease forwards;
        }
        
        .stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
        .stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
        .stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
        .stagger-children > *:nth-child(4) { animation-delay: 0.4s; }
        .stagger-children > *:nth-child(5) { animation-delay: 0.5s; }
        .stagger-children > *:nth-child(6) { animation-delay: 0.6s; }
      `}</style>

      {/* Premium cursor glow */}
      <div style={{
        position: 'fixed',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: `translate(${cursorX * 100 - 300}px, ${cursorY * 100 - 300}px)`,
        transition: 'transform 0.1s ease-out',
        zIndex: 0,
      }} />

      {/* Nav */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,215,0,0.1)',
        animation: 'slideUp 0.6s ease',
      }}>
        <div className="container nav-inner" style={{ padding: '0.8rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <div className="nav-logo-icon animate-float" style={{ fontSize: '1.8rem', marginRight: '0.75rem' }}>
              🙏
            </div>
            <div>
              <div className="nav-logo-text gradient-text" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                Matoshri Anandashram
              </div>
              <div className="nav-logo-sub" style={{ fontSize: '0.7rem', opacity: 0.6, letterSpacing: '0.1em' }}>
                Old Age Home · Jalgaon
              </div>
            </div>
          </Link>
          <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nav-link-hover hide-mobile" style={{ fontSize: '0.85rem', fontWeight: 400, letterSpacing: '0.02em' }}>
                {l.label}
              </a>
            ))}
            <Link 
              to="/register" 
              className="btn btn-primary btn-sm"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#000',
                fontWeight: 600,
                padding: '0.6rem 1.5rem',
                borderRadius: '50px',
                border: 'none',
                fontSize: '0.8rem',
                letterSpacing: '0.02em',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(255, 215, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Register Visit →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 2rem 4rem',
      }}>
        {/* Animated gradient orbs */}
        <div className="animate-float" style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255,215,0,0.15), transparent 70%)',
          borderRadius: '50%',
          top: '10%',
          left: '5%',
          filter: 'blur(60px)',
        }} />
        <div className="animate-float" style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,165,0,0.1), transparent 70%)',
          borderRadius: '50%',
          bottom: '10%',
          right: '5%',
          filter: 'blur(60px)',
          animationDelay: '2s',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div className="animate-slide-up" style={{
            display: 'inline-block',
            padding: '0.4rem 1.2rem',
            borderRadius: '50px',
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.2)',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: '#FFD700',
            marginBottom: '2rem',
          }}>
            ✦ Est. with Love & Compassion
          </div>

          <h1 className="animate-slide-up" style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientMove 4s ease infinite',
          }}>
            Matoshri Anandashram
          </h1>

          <p className="animate-slide-up" style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
            maxWidth: 600,
            margin: '0 auto 2.5rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 300,
            letterSpacing: '0.02em',
          }}>
            A sanctuary of warmth, dignity, and care for our beloved elders. 
            Every day, we serve with devotion and gratitude.
          </p>

          <div className="animate-slide-up" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/register" 
              className="btn-primary-custom"
              style={{ padding: '1rem 2.5rem', fontSize: '0.95rem' }}
            >
              Register Visit <span style={{ marginLeft: '0.5rem' }}>→</span>
            </Link>
            <Link 
              to="/bhojan-seva" 
              className="btn-outline-custom"
              style={{ padding: '1rem 2.5rem', fontSize: '0.95rem' }}
            >
              Sponsor Bhojan Seva
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{
        background: 'rgba(255,215,0,0.05)',
        padding: '2rem 0',
        borderTop: '1px solid rgba(255,215,0,0.1)',
        borderBottom: '1px solid rgba(255,215,0,0.1)',
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '2rem',
            textAlign: 'center',
          }}>
            {[
              { n: '50+', l: 'Residents' },
              { n: '₹7,500', l: 'Bhojan Seva / day' },
              { n: '365', l: 'Days of Service' },
              { n: '100%', l: 'Love & Care' },
            ].map((s) => (
              <div key={s.l} className="animate-slide-up">
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  fontFamily: 'Playfair Display, serif',
                  color: '#FFD700',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  {s.n}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: '6rem 2rem', background: '#0a0a0a' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="animate-slide-left" style={{
                color: '#FFD700',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
                About Us
              </div>
              <h2 className="animate-slide-left" style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2rem, 3vw, 3rem)',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '1.5rem',
              }}>
                A Place Elders Call Home
              </h2>
              <p className="animate-slide-left" style={{
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.8,
                marginBottom: '1rem',
                fontSize: '1rem',
                fontWeight: 300,
              }}>
                Matoshri Anandashram is a sanctuary of peace, care, and dignity for our elderly residents. 
                Located in the serene surroundings of Savkheda Shivar, Jalgaon, we provide comprehensive 
                care including nutritious meals, medical attention, recreational activities, and spiritual support.
              </p>
              <p className="animate-slide-left" style={{
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.8,
                marginBottom: '2rem',
                fontSize: '1rem',
                fontWeight: 300,
              }}>
                Our Bhojan Seva program allows kind-hearted donors to sponsor a full day's nutritious 
                lunch for all our residents — a meaningful act of service that feeds both body and soul.
              </p>
              <div className="animate-slide-left" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn-primary-custom">Register Your Visit</Link>
                <Link to="/bhojan-seva" className="btn-outline-custom">Sponsor Bhojan Seva</Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { icon: '🙏', t: 'Spiritual Care', d: 'Daily prayers & peace' },
                { icon: '🍛', t: 'Nutritious Food', d: 'Fresh home-cooked meals' },
                { icon: '🏥', t: 'Medical Support', d: 'Regular health checkups' },
                { icon: '❤️', t: 'Loving Environment', d: 'Family-like atmosphere' },
              ].map((f) => (
                <div
                  key={f.t}
                  className="card-hover glass-effect"
                  style={{
                    borderRadius: '16px',
                    padding: '1.5rem 1rem',
                    textAlign: 'center',
                  }}
                >
                  <div className="animate-float" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{f.t}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>{f.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bhojan Seva */}
      <section style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)',
        padding: '6rem 2rem',
        borderTop: '1px solid rgba(255,215,0,0.1)',
        borderBottom: '1px solid rgba(255,215,0,0.1)',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div className="animate-float" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
            🍛
          </div>
          <h2 className="animate-slide-up" style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 3vw, 2.8rem)',
            color: '#fff',
            marginBottom: '1rem',
          }}>
            Sponsor a Day of Nourishment
          </h2>
          <p className="animate-slide-up" style={{
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 500,
            margin: '0 auto 2rem',
            lineHeight: 1.8,
            fontSize: '1rem',
            fontWeight: 300,
          }}>
            For just <strong style={{ color: '#FFD700', fontSize: '1.1em' }}>₹7,500</strong>, you can sponsor 
            a complete, nutritious lunch for all our elderly residents on your chosen date — 
            on a birthday, anniversary, or any auspicious occasion.
          </p>
          <Link 
            to="/bhojan-seva" 
            className="btn-primary-custom"
            style={{ padding: '1rem 3rem', fontSize: '1rem' }}
          >
            🍛 Sponsor Bhojan Seva — ₹7,500
          </Link>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" style={{ padding: '6rem 2rem', background: '#0a0a0a' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="animate-slide-up" style={{ marginBottom: '3rem' }}>
            <div style={{
              color: '#FFD700',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}>
              Gallery
            </div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 3vw, 2.8rem)',
              fontWeight: 700,
              color: '#fff',
            }}>
              Life at Matoshri Anandashram
            </h2>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '1.5rem',
          }}>
            {GALLERY_ITEMS.map((g) => (
              <div
                key={g.title}
                className="card-hover glass-effect"
                style={{
                  borderRadius: '16px',
                  padding: '2rem 1rem',
                  textAlign: 'center',
                }}
              >
                <div className="animate-float" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {g.emoji}
                </div>
                <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.3rem' }}>
                  {g.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  {g.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map */}
      <section id="contact" style={{
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)',
        borderTop: '1px solid rgba(255,215,0,0.1)',
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <div>
              <div className="animate-slide-left" style={{
                color: '#FFD700',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}>
                Contact Us
              </div>
              <h2 className="animate-slide-left" style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '2rem',
              }}>
                Get in Touch
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { icon: '📍', label: 'Address', val: 'Savkheda Shivar, Tal & Dist. Jalgaon, Maharashtra' },
                  { icon: '📞', label: 'Phone', val: '0257 2281327 & 9423574806' },
                  { icon: '💬', label: 'WhatsApp', val: '+91 90041 84333' },
                ].map((c) => (
                  <div key={c.label} className="animate-slide-left" style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: '1.2rem', marginTop: 2 }}>{c.icon}</span>
                    <div>
                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}>
                        {c.label}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.15rem' }}>
                        {c.val}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="animate-slide-left" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn-primary-custom">Register Visit</Link>
                <a 
                  href={ORG.mapUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-outline-custom"
                >
                  📍 View on Maps
                </a>
              </div>
            </div>
            <div className="animate-slide-left">
              <div className="glass-effect" style={{
                borderRadius: '16px',
                overflow: 'hidden',
                height: 300,
              }}>
                <iframe
                  title="Matoshri Anandashram Location"
                  src="https://maps.google.com/maps?q=Matoshri+Anandashram,+Savkheda,+Jalgaon&output=embed"
                  width="100%" 
                  height="300" 
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen 
                  loading="lazy"
                />
              </div>
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <a 
                  href={ORG.mapUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#000',
        padding: '3rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="animate-slide-up">
            <div className="gradient-text" style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.2rem',
              marginBottom: '0.5rem',
            }}>
              Matoshri Anandashram
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '1.5rem',
              letterSpacing: '0.02em',
            }}>
              Savkheda Shivar, Jalgaon · 0257 2281327 · 9423574806
            </div>
            <div style={{
              display: 'flex',
              gap: '2rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}>
              {[
                { to: '/register', label: 'Register Visit' },
                { to: '/bhojan-seva', label: 'Bhojan Seva' },
                { to: '/admin/login', label: 'Admin' },
              ].map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.05em',
            }}>
              © {new Date().getFullYear()} Matoshri Anandashram. Serving with love.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
