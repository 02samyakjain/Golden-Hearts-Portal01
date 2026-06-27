import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ORG } from '../lib/supabase';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

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
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 400 });
  
  const heroRef = useRef<HTMLDivElement>(null);
  const scale = useTransform(smoothProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorX(e.clientX / window.innerWidth);
      setCursorY(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ background: '#000', color: '#fff', overflow: 'hidden' }}>
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
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,215,0,0.1)',
        }}
      >
        <div className="container nav-inner" style={{ padding: '0.8rem 2rem' }}>
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="nav-logo-icon"
              style={{ 
                fontSize: '1.8rem',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              🙏
            </motion.div>
            <div style={{ marginLeft: '0.75rem' }}>
              <div className="nav-logo-text" style={{ 
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Matoshri Anandashram
              </div>
              <div className="nav-logo-sub" style={{ fontSize: '0.7rem', opacity: 0.6, letterSpacing: '0.1em' }}>
                Old Age Home · Jalgaon
              </div>
            </div>
          </Link>
          <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {NAV_LINKS.map((l, i) => (
              <motion.a 
                key={l.href} 
                href={l.href} 
                className="hide-mobile"
                style={{ 
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 400,
                  transition: 'color 0.3s',
                  letterSpacing: '0.02em',
                  position: 'relative',
                }}
                whileHover={{ color: '#FFD700' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {l.label}
                <motion.div 
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                  }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
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
                }}
              >
                Register Visit →
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section 
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '6rem 2rem 4rem',
        }}
      >
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,215,0,0.15), transparent 70%)',
            borderRadius: '50%',
            top: '10%',
            left: '5%',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(255,165,0,0.1), transparent 70%)',
            borderRadius: '50%',
            bottom: '10%',
            right: '5%',
            filter: 'blur(60px)',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'inline-block',
              padding: '0.4rem 1.2rem',
              borderRadius: '50px',
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.2)',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: '#FFD700',
              marginBottom: '2rem',
            }}
          >
            ✦ Est. with Love & Compassion
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'gradientMove 4s ease infinite',
            }}
          >
            Matoshri Anandashram
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
              maxWidth: 600,
              margin: '0 auto 2.5rem',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 300,
              letterSpacing: '0.02em',
            }}
          >
            A sanctuary of warmth, dignity, and care for our beloved elders. 
            Every day, we serve with devotion and gratitude.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/register" 
                className="btn btn-lg"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#000',
                  fontWeight: 600,
                  padding: '1rem 2.5rem',
                  borderRadius: '50px',
                  border: 'none',
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                Register Visit <span style={{ marginLeft: '0.5rem' }}>→</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/bhojan-seva" 
                className="btn btn-lg"
                style={{
                  background: 'transparent',
                  color: '#FFD700',
                  fontWeight: 500,
                  padding: '1rem 2.5rem',
                  borderRadius: '50px',
                  border: '1px solid rgba(255,215,0,0.3)',
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
                }}
              >
                Sponsor Bhojan Seva
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats strip */}
      <motion.section 
        style={{
          background: 'rgba(255,215,0,0.05)',
          padding: '2rem 0',
          borderTop: '1px solid rgba(255,215,0,0.1)',
          borderBottom: '1px solid rgba(255,215,0,0.1)',
        }}
      >
        <div className="container">
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
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    fontFamily: 'Playfair Display, serif',
                    color: '#FFD700',
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {s.n}
                </motion.div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                  {s.l}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About */}
      <section id="about" style={{ padding: '6rem 2rem', background: '#0a0a0a' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                style={{
                  color: '#FFD700',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}
              >
                About Us
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(2rem, 3vw, 3rem)',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '1.5rem',
                }}
              >
                A Place Elders Call Home
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.8,
                  marginBottom: '1rem',
                  fontSize: '1rem',
                  fontWeight: 300,
                }}
              >
                Matoshri Anandashram is a sanctuary of peace, care, and dignity for our elderly residents. 
                Located in the serene surroundings of Savkheda Shivar, Jalgaon, we provide comprehensive 
                care including nutritious meals, medical attention, recreational activities, and spiritual support.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                  fontSize: '1rem',
                  fontWeight: 300,
                }}
              >
                Our Bhojan Seva program allows kind-hearted donors to sponsor a full day's nutritious 
                lunch for all our residents — a meaningful act of service that feeds both body and soul.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/register" 
                    className="btn btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      color: '#000',
                      fontWeight: 600,
                      padding: '0.8rem 2rem',
                      borderRadius: '50px',
                      border: 'none',
                      fontSize: '0.9rem',
                    }}
                  >
                    Register Your Visit
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/bhojan-seva" 
                    className="btn btn-outline"
                    style={{
                      background: 'transparent',
                      color: '#FFD700',
                      fontWeight: 500,
                      padding: '0.8rem 2rem',
                      borderRadius: '50px',
                      border: '1px solid rgba(255,215,0,0.3)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Sponsor Bhojan Seva
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { icon: '🙏', t: 'Spiritual Care', d: 'Daily prayers & peace' },
                { icon: '🍛', t: 'Nutritious Food', d: 'Fresh home-cooked meals' },
                { icon: '🏥', t: 'Medical Support', d: 'Regular health checkups' },
                { icon: '❤️', t: 'Loving Environment', d: 'Family-like atmosphere' },
              ].map((f, i) => (
                <motion.div
                  key={f.t}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05,
                    background: 'rgba(255,215,0,0.1)',
                    transition: { duration: 0.2 }
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '16px',
                    padding: '1.5rem 1rem',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{f.t}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>{f.d}</div>
                </motion.div>
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
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: '4rem', marginBottom: '1.5rem' }}
            >
              🍛
            </motion.div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 3vw, 2.8rem)',
              color: '#fff',
              marginBottom: '1rem',
            }}
          >
            Sponsor a Day of Nourishment
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            style={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 500,
              margin: '0 auto 2rem',
              lineHeight: 1.8,
              fontSize: '1rem',
              fontWeight: 300,
            }}
          >
            For just <strong style={{ color: '#FFD700', fontSize: '1.1em' }}>₹7,500</strong>, you can sponsor 
            a complete, nutritious lunch for all our elderly residents on your chosen date — 
            on a birthday, anniversary, or any auspicious occasion.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/bhojan-seva" 
              className="btn btn-primary btn-lg"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#000',
                fontWeight: 600,
                padding: '1rem 3rem',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              🍛 Sponsor Bhojan Seva — ₹7,500
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" style={{ padding: '6rem 2rem', background: '#0a0a0a' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ marginBottom: '3rem' }}
          >
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
          </motion.div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '1.5rem',
          }}>
            {GALLERY_ITEMS.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  borderColor: 'rgba(255,215,0,0.3)',
                }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
              >
                <motion.div 
                  style={{ fontSize: '3rem', marginBottom: '1rem' }}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  {g.emoji}
                </motion.div>
                <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.3rem' }}>
                  {g.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                  {g.desc}
                </div>
              </motion.div>
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
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                style={{
                  color: '#FFD700',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Contact Us
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '2rem',
                }}
              >
                Get in Touch
              </motion.h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { icon: '📍', label: 'Address', val: 'Savkheda Shivar, Tal & Dist. Jalgaon, Maharashtra' },
                  { icon: '📞', label: 'Phone', val: '0257 2281327 & 9423574806' },
                  { icon: '💬', label: 'WhatsApp', val: '+91 90041 84333' },
                ].map((c, i) => (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                    }}
                  >
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
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/register" 
                    className="btn btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      color: '#000',
                      fontWeight: 600,
                      padding: '0.8rem 2rem',
                      borderRadius: '50px',
                      border: 'none',
                      fontSize: '0.9rem',
                    }}
                  >
                    Register Visit
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a 
                    href={ORG.mapUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{
                      display: 'inline-block',
                      background: 'transparent',
                      color: '#FFD700',
                      fontWeight: 500,
                      padding: '0.8rem 2rem',
                      borderRadius: '50px',
                      border: '1px solid rgba(255,215,0,0.3)',
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                    }}
                  >
                    📍 View on Maps
                  </a>
                </motion.div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255,215,0,0.1)',
                height: 300,
                background: 'rgba(255,255,255,0.03)',
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
            </motion.div>
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
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
