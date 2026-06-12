"use client";

import React, { useEffect, useState } from "react";

export default function Footer() {
  const [particles, setParticles] = useState<{ id: number; size: number; left: number; bottom: number; duration: number; delay: number; opacity: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      left: Math.random() * 100,
      bottom: Math.random() * 20,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500&display=swap');

        .kopi-footer {
          width: 100%;
          min-height: 100vh;
          background: #1a0f08;
          color: #f5ede3;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }

        /* — Noise texture overlay — */
        .kopi-footer::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.35;
          pointer-events: none;
          z-index: 0;
        }

        /* — Radial warm glow — */
        .kopi-footer .glow {
          position: absolute;
          bottom: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 400px;
          background: radial-gradient(ellipse at center, rgba(196,120,50,0.18) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          animation: glowPulse 5s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.08); }
        }

        /* — Floating coffee particles — */
        .kopi-footer .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .kopi-footer .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(196,120,50,0.15);
          animation: floatUp linear infinite;
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-80vh) scale(0.3); opacity: 0; }
        }

        /* — Steam wisps — */
        .kopi-footer .steam-container {
          position: absolute;
          top: 18%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 18px;
          z-index: 1;
          pointer-events: none;
        }
        .kopi-footer .wisp {
          width: 2px;
          height: 60px;
          background: linear-gradient(to top, rgba(245,237,227,0.12), transparent);
          border-radius: 2px;
          animation: steamRise 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .kopi-footer .wisp:nth-child(2) { animation-delay: 0.8s; height: 45px; }
        .kopi-footer .wisp:nth-child(3) { animation-delay: 1.6s; height: 55px; }
        @keyframes steamRise {
          0% { transform: scaleY(0) translateY(10px); opacity: 0; }
          20% { opacity: 1; }
          70% { transform: scaleY(1.4) translateY(-20px) rotate(4deg); opacity: 0.5; }
          100% { transform: scaleY(1.8) translateY(-40px) rotate(-3deg); opacity: 0; }
        }

        /* — Dashed ring decoration — */
        .kopi-footer .decor-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          border: 1px dashed rgba(255,255,255,0.15);
          pointer-events: none;
          z-index: 0;
          animation: ringExpand 8s ease-out infinite;
          transform-origin: center;
        }
        .kopi-footer .decor-ring:nth-child(1) { width: 340px; height: 340px; margin: -170px 0 0 -170px; animation-delay: 0s; }
        .kopi-footer .decor-ring:nth-child(2) { width: 520px; height: 520px; margin: -260px 0 0 -260px; animation-delay: 2s; }
        .kopi-footer .decor-ring:nth-child(3) { width: 700px; height: 700px; margin: -350px 0 0 -350px; animation-delay: 4s; }
        @keyframes ringExpand {
          0% { opacity: 0; transform: scale(0.85); }
          20% { opacity: 1; }
          80% { opacity: 0.3; }
          100% { opacity: 0; transform: scale(1.05); }
        }

        /* — Main content — */
        .kopi-footer .content {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px 60px;
          text-align: center;
          gap: 0;
        }

        .kopi-footer .eyebrow {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c47832;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .kopi-footer .heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 20px;
          color: #f5ede3;
          position: relative;
        }
        .kopi-footer .heading span {
          color: #c47832;
          position: relative;
          display: inline-block;
        }
        /* shimmer on accent word */
        .kopi-footer .heading span::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,210,140,0.7) 50%, transparent 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .kopi-footer .subtext {
          color: rgba(245,237,227,0.55);
          font-size: 15px;
          line-height: 1.7;
          max-width: 420px;
          margin: 0 auto 52px;
          font-weight: 300;
        }

        /* — Social icons — */
        .kopi-footer .socials {
          display: flex;
          gap: 20px;
          margin-bottom: 64px;
        }
        .kopi-footer .social-link {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(196,120,50,0.25);
          color: rgba(245,237,227,0.6);
          text-decoration: none;
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
          background: rgba(196,120,50,0.04);
        }
        .kopi-footer .social-link svg { width: 22px; height: 22px; transition: transform 0.3s; }
        .kopi-footer .social-link:hover {
          background: #c47832;
          border-color: #c47832;
          color: #1a0f08;
          transform: translateY(-4px) scale(1.08);
          box-shadow: 0 12px 28px rgba(196,120,50,0.3);
        }
        .kopi-footer .social-link:hover svg { transform: scale(1.1); }

        /* — Location strip — */
        .kopi-footer .location-strip {
          display: flex;
          gap: 32px;
          margin-bottom: 0;
          flex-wrap: wrap;
          justify-content: center;
        }
        .kopi-footer .loc-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .kopi-footer .loc-label {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c47832;
          font-weight: 500;
        }
        .kopi-footer .loc-value {
          font-size: 13px;
          color: rgba(245,237,227,0.5);
          font-weight: 300;
        }

        /* — Divider — */
        .kopi-footer .divider-wrap {
          position: relative;
          z-index: 2;
          padding: 0 24px;
        }
        .kopi-footer .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(196,120,50,0.3) 30%, rgba(196,120,50,0.3) 70%, transparent);
          position: relative;
        }
        .kopi-footer .divider-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c47832;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 12px #c47832;
          animation: dotPulse 2.5s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 8px #c47832; opacity: 1; }
          50% { box-shadow: 0 0 20px #c47832, 0 0 40px rgba(196,120,50,0.3); opacity: 0.7; }
        }

        /* — Bottom bar — */
        .kopi-footer .bottom {
          position: relative;
          z-index: 2;
          padding: 24px 24px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .kopi-footer .bottom-links {
          display: flex;
          gap: 28px;
        }
        .kopi-footer .bottom-links a {
          font-size: 12px;
          color: rgba(245,237,227,0.35);
          text-decoration: none;
          letter-spacing: 0.05em;
          transition: color 0.2s;
        }
        .kopi-footer .bottom-links a:hover { color: #c47832; }
        .kopi-footer .copyright {
          font-size: 12px;
          color: rgba(245,237,227,0.25);
          letter-spacing: 0.04em;
        }

        /* — Cup icon — */
        .kopi-footer .cup-icon {
          position: absolute;
          right: 32px;
          top: 32px;
          opacity: 0.06;
          z-index: 0;
          pointer-events: none;
        }
        .kopi-footer .cup-icon svg {
          width: 220px;
          height: 220px;
          color: #c47832;
        }

        /* scrolling marquee */
        .kopi-footer .marquee-wrap {
          position: absolute;
          bottom: 110px;
          left: 0; right: 0;
          overflow: hidden;
          z-index: 1;
          pointer-events: none;
          opacity: 0.07;
        }
        .kopi-footer .marquee-track {
          display: flex;
          gap: 48px;
          white-space: nowrap;
          animation: marqueeScroll 18s linear infinite;
          font-family: 'Playfair Display', serif;
          font-size: 60px;
          font-weight: 700;
          color: #c47832;
          letter-spacing: -0.02em;
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <footer className="kopi-footer">
        {/* Background rings */}
        <div className="decor-ring"></div>
        <div className="decor-ring"></div>
        <div className="decor-ring"></div>

        {/* Glow */}
        <div className="glow"></div>

        {/* Floating particles (JS generated) */}
        <div className="particles" id="particles">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                width: p.size,
                height: p.size,
                left: p.left + "%",
                bottom: p.bottom + "%",
                animationDuration: p.duration + "s",
                animationDelay: p.delay + "s",
                opacity: p.opacity,
              }}
            ></div>
          ))}
        </div>

        {/* Steam */}
        <div className="steam-container">
          <div className="wisp"></div>
          <div className="wisp"></div>
          <div className="wisp"></div>
        </div>

        {/* Cup watermark */}
        <div className="cup-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            <line x1="6" y1="2" x2="6" y2="4"/>
            <line x1="10" y1="2" x2="10" y2="4"/>
            <line x1="14" y1="2" x2="14" y2="4"/>
          </svg>
        </div>

        {/* Scrolling watermark */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            <span>Kopi Mood</span><span>·</span><span>Kopi Mood</span><span>·</span><span>Kopi Mood</span><span>·</span><span>Kopi Mood</span><span>·</span><span>Kopi Mood</span><span>·</span><span>Kopi Mood</span><span>·</span><span>Kopi Mood</span><span>·</span><span>Kopi Mood</span><span>·</span>
          </div>
        </div>

        {/* Main content */}
        <div className="content">
          <p className="eyebrow">Ikuti Kami</p>

          <h3 className="heading">
            Tetap Terhubung<br/>Bersama <span data-text="Kopi Mood">Kopi Mood</span>
          </h3>

          <p className="subtext">
            Jadilah yang pertama tahu promo rahasia, menu baru, dan momen hangat dari dapur kami.
          </p>

          <div className="socials">
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
            {/* Twitter / X */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* TikTok */}
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-link">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.22 8.22 0 0 0 4.82 1.54V6.83a4.84 4.84 0 0 1-1.05-.14z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-wrap">
          <div className="divider-line">
            <div className="divider-dot"></div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bottom">
          <div className="bottom-links">
            <a href="#">Syarat & Ketentuan</a>
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Kontak</a>
          </div>
          <p className="copyright">© 2026 Kopi Mood. Dibuat dengan ☕ dan cinta.</p>
        </div>
      </footer>
    </>
  );
}