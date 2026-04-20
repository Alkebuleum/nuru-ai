import React, { useEffect, useRef } from 'react';

export default function App() {
  const starsRef = useRef(null);
  const nuruRef  = useRef(null);

  // Star field
  useEffect(() => {
    const c = starsRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    function drawStars() {
      ctx.clearRect(0, 0, c.width, c.height);
      for (let i = 0; i < 180; i++) {
        const x = Math.random() * c.width;
        const y = Math.random() * c.height;
        const r = Math.random() * 1.2;
        const a = Math.random() * 0.5 + 0.1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      }
    }
    function resize() { c.width = window.innerWidth; c.height = window.innerHeight; drawStars(); }
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Nuru AI canvas
  useEffect(() => {
    const canvas = nuruRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, cx, cy, t = 0;
    let targetOffX = 0, targetOffY = 0;
    let offX = 0, offY = 0;
    let animId;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width  = rect.width  * window.devicePixelRatio;
      H = canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width  = rect.width  + 'px';
      canvas.style.height = rect.height + 'px';
      cx = W / 2; cy = H / 2;
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      targetOffX = (e.clientX - rect.left - rect.width  / 2) * 0.03;
      targetOffY = (e.clientY - rect.top  - rect.height / 2) * 0.03;
    }

    function lerp(a, b, k) { return a + (b - a) * k; }

    function draw() {
      t   += 0.008;
      offX = lerp(offX, targetOffX, 0.06);
      offY = lerp(offY, targetOffY, 0.06);
      ctx.clearRect(0, 0, W, H);

      const ox = cx + offX * window.devicePixelRatio;
      const oy = cy + offY * window.devicePixelRatio;
      const R  = Math.min(W, H) * 0.42;

      // Ambient glow
      const amb = ctx.createRadialGradient(ox, oy, 0, ox, oy, R * 1.3);
      amb.addColorStop(0,   'rgba(245,184,0,0.08)');
      amb.addColorStop(0.4, 'rgba(167,139,250,0.05)');
      amb.addColorStop(1,   'transparent');
      ctx.fillStyle = amb;
      ctx.beginPath(); ctx.arc(ox, oy, R * 1.3, 0, Math.PI * 2); ctx.fill();

      // Rings
      [
        { r: R * 0.95, color: 'rgba(255,255,255,0.04)', w: 1 },
        { r: R * 0.68, color: 'rgba(167,139,250,0.12)', w: 1 },
        { r: R * 0.45, color: 'rgba(245,184,0,0.18)',   w: 1.2 },
        { r: R * 0.25, color: 'rgba(255,255,255,0.1)',  w: 1 },
      ].forEach(({ r, color, w }) => {
        ctx.beginPath();
        ctx.arc(ox, oy, r + Math.sin(t * 1.5) * r * 0.015, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth   = w * window.devicePixelRatio;
        ctx.stroke();
      });

      // Rays
      for (let i = 0; i < 24; i++) {
        const angle  = (i / 24) * Math.PI * 2 + t * 0.15;
        const phase  = Math.sin(t * 1.2 + i * 0.5) * 0.5 + 0.5;
        const innerR = R * 0.32 + R * 0.04 * phase;
        const outerR = R * (0.55 + 0.35 * phase);
        const alpha  = 0.08 + 0.45 * phase;
        const norm   = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

        ctx.beginPath();
        ctx.moveTo(ox + Math.cos(angle) * innerR, oy + Math.sin(angle) * innerR);
        ctx.lineTo(ox + Math.cos(angle) * outerR, oy + Math.sin(angle) * outerR);
        ctx.lineWidth = (1 + phase * 1.5) * window.devicePixelRatio;
        if      (norm < Math.PI * 0.67) ctx.strokeStyle = `rgba(245,184,0,${alpha})`;
        else if (norm < Math.PI * 1.33) ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
        else                             ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
        ctx.stroke();
      }

      // Orbiting dots
      [
        { speed: 0.4,   radius: R * 0.60, size: 3.5, color: '#AAFF45', glow: 'rgba(170,255,69,0.4)',   ph: 0 },
        { speed: -0.25, radius: R * 0.80, size: 2.5, color: '#3B82F6', glow: 'rgba(59,130,246,0.35)',  ph: 1.2 },
        { speed: 0.18,  radius: R * 0.72, size: 2,   color: '#F5B800', glow: 'rgba(245,184,0,0.4)',    ph: 2.8 },
      ].forEach(({ speed, radius, size, color, glow, ph }) => {
        const a  = t * speed + ph;
        const dx = ox + Math.cos(a) * radius;
        const dy = oy + Math.sin(a) * radius;
        const s  = size * window.devicePixelRatio;
        const g  = ctx.createRadialGradient(dx, dy, 0, dx, dy, s * 5);
        g.addColorStop(0, glow); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(dx, dy, s * 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(dx, dy, s,     0, Math.PI * 2); ctx.fill();
      });

      // Core
      const coreR = R * 0.22;
      const cg = ctx.createRadialGradient(ox, oy, 0, ox, oy, coreR * 2.5);
      cg.addColorStop(0,   'rgba(245,184,0,0.3)');
      cg.addColorStop(0.5, 'rgba(167,139,250,0.15)');
      cg.addColorStop(1,   'transparent');
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.arc(ox, oy, coreR * 2.5, 0, Math.PI * 2); ctx.fill();

      const grad = ctx.createLinearGradient(ox - coreR, oy - coreR, ox + coreR, oy + coreR);
      grad.addColorStop(0, '#F5B800'); grad.addColorStop(1, '#A78BFA');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(ox, oy, coreR, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth   = 1.5 * window.devicePixelRatio;
      ctx.stroke();


      // Pulse ring
      const pa = (Math.sin(t * 2) * 0.5 + 0.5) * 0.25;
      ctx.beginPath();
      ctx.arc(ox, oy, coreR * (1.5 + Math.sin(t * 2) * 0.1), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(245,184,0,${pa})`;
      ctx.lineWidth   = 1 * window.devicePixelRatio;
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    }

    canvas.parentElement.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', resize);
    resize();
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (canvas.parentElement) canvas.parentElement.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const checkSvg = (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 5l2 2 4-4" stroke="#AAFF45" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">
          <svg width="26" height="26" viewBox="0 0 30 30" fill="none">
            <defs>
              <linearGradient id="nlG" x1="15" y1="0" x2="15" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F5B800"/>
                <stop offset="100%" stopColor="#3B82F6"/>
              </linearGradient>
            </defs>
            <g stroke="url(#nlG)" strokeWidth="1.8" strokeLinecap="round" opacity="0.75">
              <line x1="15" y1="1" x2="15" y2="6"/><line x1="15" y1="24" x2="15" y2="29"/>
              <line x1="1" y1="15" x2="6" y2="15"/><line x1="24" y1="15" x2="29" y2="15"/>
              <line x1="4.4" y1="4.4" x2="8.2" y2="8.2"/><line x1="21.8" y1="21.8" x2="25.6" y2="25.6"/>
              <line x1="25.6" y1="4.4" x2="21.8" y2="8.2"/><line x1="4.4" y1="25.6" x2="8.2" y2="21.8"/>
            </g>
            <circle cx="15" cy="15" r="4.5" fill="url(#nlG)"/>
          </svg>
          Nuru
        </a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#wallet">Wallet</a></li>
          <li><a href="#download">Download</a></li>
          <li><a href="privacy.html">Privacy</a></li>
          <li><a href="terms.html">Terms</a></li>
        </ul>
        <a href="#download" className="nav-dl">Download app ↓</a>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg"></div>
        <canvas className="stars" ref={starsRef}></canvas>

        <div className="hero-copy">
          <div className="hero-guide-tag">
            <div className="guide-tag-dot"></div>
            <span className="guide-tag-text">AI Guide — Now Live</span>
          </div>
          <h1 className="hero-headline">
            Meet<br/>
            <span className="line-dim">Nuru.</span><br/>
            <span className="line-gold">Your guide.</span>
          </h1>
          <p className="hero-sub">
            Nuru is an <strong>AI-powered guide</strong> for your identity and finances on the Alkebuleum network. She knows you, she protects you, and she opens doors — starting with the <strong>Nuru Wallet</strong>.
          </p>
          <div className="hero-ctas">
            <div className="hero-store-row">
              <a href="#" className="store-pill">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" opacity="0.85">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="sp-texts">
                  <span className="sp-sub">Download on the</span>
                  <span className="sp-name">App Store</span>
                </div>
              </a>
              <a href="#" className="store-pill">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 20.5l8.5-8.5M3 3.5l8.5 8.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.85"/>
                  <path d="M3 3.5L17 12 3 20.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.85"/>
                  <path d="M17 12l-5.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
                  <path d="M17 12l-5.5-3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
                </svg>
                <div className="sp-texts">
                  <span className="sp-sub">Get it on</span>
                  <span className="sp-name">Google Play</span>
                </div>
              </a>
            </div>
            <a href="#wallet" className="hero-wallet-link">
              Explore the Nuru Wallet
              <span className="hwl-arrow">→</span>
            </a>
          </div>
        </div>

        {/* Nuru illustration */}
        <div className="nuru-stage">
          <div className="nuru-canvas">
            <div className="nuru-halo"></div>
            <canvas ref={nuruRef} style={{width:'100%',height:'100%',display:'block',position:'relative',zIndex:2}}></canvas>
            <div className="data-fragment df-1"><span className="df-dot" style={{background:'#AAFF45'}}></span>Identity Verified</div>
            <div className="data-fragment df-2"><span className="df-dot" style={{background:'#3B82F6'}}></span>validator.alke</div>
            <div className="data-fragment df-3"><span className="df-dot" style={{background:'#F5B800'}}></span>Master Key Active</div>
            <div className="data-fragment df-4"><span className="df-dot" style={{background:'#A78BFA'}}></span>Guardian Active</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-band">
        <div className="marquee-inner">
          {[
            'AI Identity Guide','Self-Sovereign Identity','Nuru Wallet','.alke Name Service',
            'Smart Account Abstraction','On-Chain Credit Score','Recovery Guardians',
            'Physical Identity Card','Gasless Transactions',
            'AI Identity Guide','Self-Sovereign Identity','Nuru Wallet','.alke Name Service',
            'Smart Account Abstraction','On-Chain Credit Score','Recovery Guardians',
            'Physical Identity Card','Gasless Transactions',
          ].map((item, i) => (
            <span key={i} className="mq-item">{item} <span className="mq-sep"></span></span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="about-eyebrow reveal">Who is Nuru?</div>
        <h2 className="about-title reveal">
          An AI that guides you through<br/>
          <span>identity, finance, and beyond.</span>
        </h2>
        <div className="pillars">
          <div className="pillar reveal">
            <div className="pillar-num">01</div>
            <div className="pillar-icon pi-g">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="9" r="4" stroke="#F5B800" strokeWidth="1.5"/>
                <path d="M5 21c0-4 3.6-7 8-7s8 3 8 7" stroke="#F5B800" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M20 9l2 2-2 2" stroke="#F5B800" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="pillar-title">Your Identity, Owned</div>
            <div className="pillar-body">Nuru creates and protects your on-chain digital identity. Your AIN number, your .alke name, your verified credentials — all cryptographically yours, forever.</div>
          </div>
          <div className="pillar reveal reveal-delay-1">
            <div className="pillar-num">02</div>
            <div className="pillar-icon pi-v">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <rect x="4" y="8" width="18" height="14" rx="3" stroke="#A78BFA" strokeWidth="1.5"/>
                <path d="M4 13h18" stroke="#A78BFA" strokeWidth="1.5"/>
                <path d="M9 5h8" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="18" cy="17" r="2" fill="#A78BFA"/>
              </svg>
            </div>
            <div className="pillar-title">Finance, Simplified</div>
            <div className="pillar-body">From managing assets to understanding DeFi, Nuru guides you through every financial decision with intelligence — not just a wallet, but a true financial companion.</div>
          </div>
          <div className="pillar reveal reveal-delay-2">
            <div className="pillar-num">03</div>
            <div className="pillar-icon pi-b">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M5 18l4-4.5 4 3 4-5.5 4 4" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="4" width="20" height="18" rx="3" stroke="#3B82F6" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="pillar-title">AI That Grows With You</div>
            <div className="pillar-body">Nuru learns from your activity and builds an on-chain reputation score that unlocks new services, credit, and opportunities across the Alkebuleum ecosystem.</div>
          </div>
        </div>
      </section>

      {/* WALLET */}
      <section className="wallet-strip reveal" id="wallet">
        <div className="ws-inner">
          <div className="ws-copy">
            <div className="ws-tag"><div className="ws-tag-dot"></div>First Product</div>
            <h3 className="ws-title">The Nuru Wallet is Nuru's first gift to you.</h3>
            <p className="ws-body">A beautifully designed, self-custodial wallet built for the Alkebuleum ecosystem. Your identity and finances, in your pocket — with Nuru watching over both.</p>
            <div className="ws-features">
              {['AIN Digital Identity Card','ERC-4337 Smart Account','.alke Name Service','Physical NFC Identity Card'].map((f, i) => (
                <div key={i} className="wsf-item">
                  <div className="wsf-check">{checkSvg}</div>
                  {f}
                </div>
              ))}
            </div>
            <a href="#download" className="nav-dl" style={{alignSelf:'flex-start',textDecoration:'none'}}>Download free →</a>
          </div>
          <div className="ws-visual">
            <div className="ws-phone-glow"></div>
            <div className="phone-mock">
              <div style={{background:'linear-gradient(135deg,#c9901a,#9b6eea,#5b3fb5)',height:'6px'}}></div>
              <div className="phone-screen">
                <div className="pm-bar"></div>
                <div className="pm-balance">$87.06</div>
                <div className="pm-change">+$1.68 (+1.96%)</div>
                <div className="pm-btns">
                  {['Buy','Swap','Send','Recv'].map(b => <div key={b} className="pm-btn">{b}</div>)}
                </div>
                <div className="pm-card">
                  <div className="pm-card-n">✦ Nuru</div>
                  <div className="pm-card-name">Identity Holder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOAD */}
      <section className="download reveal" id="download">
        <div className="dl-bg"></div>
        <div className="dl-lines">
          <div className="dl-line"></div><div className="dl-line"></div>
          <div className="dl-line"></div><div className="dl-line"></div>
          <div className="dl-line"></div>
        </div>
        <div className="dl-inner">
          <div className="dl-nuru-tag">
            <svg width="14" height="14" viewBox="0 0 30 30" fill="none">
              <defs>
                <linearGradient id="dlG" x1="15" y1="0" x2="15" y2="30" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#F5B800"/>
                  <stop offset="100%" stopColor="#3B82F6"/>
                </linearGradient>
              </defs>
              <g stroke="url(#dlG)" strokeWidth="2" strokeLinecap="round" opacity="0.8">
                <line x1="15" y1="1" x2="15" y2="7"/><line x1="15" y1="23" x2="15" y2="29"/>
                <line x1="1" y1="15" x2="7" y2="15"/><line x1="23" y1="15" x2="29" y2="15"/>
              </g>
              <circle cx="15" cy="15" r="5" fill="url(#dlG)"/>
            </svg>
            Nuru — Free forever
          </div>
          <h2 className="dl-title">
            Let Nuru<br/>
            <span className="accent">guide you.</span>
          </h2>
          <p className="dl-sub">Download the Nuru Wallet and take your first step into self-sovereign identity and finance. Available now on iOS and Android.</p>
          <div className="dl-btns">
            <a href="#" className="dl-btn dl-btn-primary">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="black">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="dl-btn-texts">
                <span className="dl-btn-sub">Download on the</span>
                <span className="dl-btn-name">App Store</span>
              </div>
            </a>
            <a href="#" className="dl-btn dl-btn-secondary">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M3 20.5l8.5-8.5M3 3.5l8.5 8.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M3 3.5L17 12 3 20.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <div className="dl-btn-texts">
                <span className="dl-btn-sub">Get it on</span>
                <span className="dl-btn-name">Google Play</span>
              </div>
            </a>
          </div>
          <p className="dl-legal">
            By downloading you agree to our{' '}
            <a href="terms.html">Terms of Service</a> and{' '}
            <a href="privacy.html">Privacy Policy</a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <a href="#" className="footer-logo">
          <svg width="20" height="20" viewBox="0 0 30 30" fill="none">
            <defs>
              <linearGradient id="ftG" x1="15" y1="0" x2="15" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F5B800"/>
                <stop offset="100%" stopColor="#3B82F6"/>
              </linearGradient>
            </defs>
            <g stroke="url(#ftG)" strokeWidth="1.8" strokeLinecap="round" opacity="0.6">
              <line x1="15" y1="1" x2="15" y2="6"/><line x1="15" y1="24" x2="15" y2="29"/>
              <line x1="1" y1="15" x2="6" y2="15"/><line x1="24" y1="15" x2="29" y2="15"/>
              <line x1="4.4" y1="4.4" x2="8.2" y2="8.2"/><line x1="21.8" y1="21.8" x2="25.6" y2="25.6"/>
              <line x1="25.6" y1="4.4" x2="21.8" y2="8.2"/><line x1="4.4" y1="25.6" x2="8.2" y2="21.8"/>
            </g>
            <circle cx="15" cy="15" r="4" fill="url(#ftG)"/>
          </svg>
          Nuru
        </a>
        <ul className="footer-links">
          <li><a href="#about">About</a></li>
          <li><a href="#wallet">Wallet</a></li>
          <li><a href="#download">Download</a></li>
          <li><a href="privacy.html">Privacy Policy</a></li>
          <li><a href="terms.html">Terms of Service</a></li>
        </ul>
        <p className="footer-copy">© 2025 Nuru · AI Guide for Identity &amp; Finance · Built on Alkebuleum</p>
      </footer>
    </>
  );
}
