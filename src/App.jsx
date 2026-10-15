import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

/* ═══════════════════════════════════════════
   GLOBAL STYLES (injected once)
═══════════════════════════════════════════ */
const GlobalStyle = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --red: #ff2a4b; --red2: #ff6b6b;
        --bg: #030407; --bg2: #08090f; --bg3: #0d0f18;
        --border: rgba(255,42,75,0.2); --border-light: rgba(255,255,255,0.07);
        --text: #f0f1f5; --muted: #8a8f9e; --glass: rgba(10,11,18,0.75);
      }
      html { scroll-behavior: smooth; }
      body {
        background: var(--bg); color: var(--text);
        font-family: 'Inter', sans-serif;
        overflow-x: hidden; -webkit-font-smoothing: antialiased;
      }
      a { text-decoration: none; color: inherit; }

      /* NAV */
      .nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
        height: 70px; display: flex; align-items: center; justify-content: space-between;
        padding: 0 6%; background: rgba(3,4,7,0.8);
        backdrop-filter: blur(24px); border-bottom: 1px solid var(--border-light);
        transition: all .3s;
      }
      .nav.scrolled { background: rgba(3,4,7,0.97); border-bottom-color: var(--border); box-shadow: 0 8px 40px rgba(0,0,0,.7); }
      .nav-brand { font: 800 20px 'Space Grotesk'; display: flex; align-items: center; gap: 8px; }
      .nav-brand span { color: var(--red); text-shadow: 0 0 14px var(--red); }
      .nav-links { display: flex; gap: 8px; }
      .nav-links a {
        padding: 8px 18px; border-radius: 30px; font: 600 13px 'Space Grotesk'; letter-spacing: .5px;
        color: var(--muted); transition: all .3s; border: 1px solid transparent;
      }
      .nav-links a:hover { color: #fff; border-color: var(--border-light); background: rgba(255,255,255,.04); }
      .nav-links a.active { color: #fff; background: var(--red); border-color: transparent; box-shadow: 0 4px 20px rgba(255,42,75,.35); }
      .nav-links a.cart-btn { background: rgba(255,42,75,.1); border-color: var(--border); color: var(--red); }
      .nav-links a.cart-btn:hover { background: var(--red); color: #fff; }

      /* HERO */
      .hero {
        min-height: 100vh; display: flex; align-items: center;
        padding: 100px 6% 60px; position: relative; overflow: hidden;
      }
      .hero-blob {
        position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0;
      }
      .hero-content { position: relative; z-index: 1; max-width: 700px; }
      .eyebrow {
        display: inline-flex; align-items: center; gap: 10px;
        color: var(--red); font: 700 10px 'Space Grotesk'; letter-spacing: 3px;
        background: rgba(255,42,75,.08); border: 1px solid rgba(255,42,75,.22);
        padding: 7px 16px; border-radius: 30px; margin-bottom: 28px;
      }
      .eyebrow::before { content:''; width:7px; height:7px; background:var(--red); border-radius:50%; animation: pulse 1.5s infinite; }
      @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.4;transform:scale(1.4);} }
      .hero h1 { font: 800 clamp(46px,7vw,88px)/1 'Space Grotesk'; margin-bottom: 20px; }
      .hero h1 em { font-style:normal; color:var(--red); }
      .hero-sub { font-size: 17px; color: var(--muted); line-height: 1.8; max-width: 560px; margin-bottom: 40px; }
      .btn-group { display:flex; gap:14px; flex-wrap:wrap; }
      .btn {
        display: inline-flex; align-items:center; gap:8px;
        padding: 14px 28px; border-radius: 12px;
        font: 700 13.5px 'Space Grotesk'; transition: all .3s; cursor: pointer; border: none;
      }
      .btn-primary { background: var(--red); color:#fff; box-shadow: 0 10px 35px rgba(255,42,75,.3); }
      .btn-primary:hover { transform:translateY(-3px); box-shadow: 0 18px 50px rgba(255,42,75,.5); }
      .btn-ghost {
        background: transparent; color:#fff; border: 1px solid var(--border-light);
      }
      .btn-ghost:hover { border-color:var(--red); background:rgba(255,42,75,.07); transform:translateY(-3px); }
      .stats-row { display:flex; gap:40px; margin-top:52px; flex-wrap:wrap; }
      .stat { display:flex; flex-direction:column; }
      .stat-n { font: 800 38px 'Space Grotesk'; color:#fff; }
      .stat-n span { color:var(--red); font-size:22px; }
      .stat-l { font-size:11px; color:var(--muted); margin-top:3px; letter-spacing:1px; }

      /* SECTION */
      .section { padding: 120px 6%; position:relative; border-top: 1px solid var(--border-light); }
      .section-head { margin-bottom:60px; }
      .sec-num { font:700 11px 'Space Grotesk'; color:var(--red); letter-spacing:2.5px; }
      .sec-label { font-size:10px; color:#505367; letter-spacing:3px; margin-left:12px; }
      .section-head h2 { font:700 clamp(30px,4vw,52px)/1.1 'Space Grotesk'; margin-top:14px; }
      .section-head h2 em { color:var(--red); font-style:normal; }

      /* CARDS */
      .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
      .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
      .card {
        background:var(--bg2); border:1px solid var(--border-light); border-radius:20px;
        padding:32px 28px; transition: all .35s cubic-bezier(.22,1,.36,1);
        position:relative; overflow:hidden;
      }
      .card::before { content:''; position:absolute; inset:0; background:radial-gradient(circle at 50% 0%,rgba(255,42,75,.07),transparent 70%); opacity:0; transition:.3s; }
      .card:hover { transform:translateY(-8px); border-color:rgba(255,42,75,.4); box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 40px rgba(255,42,75,.1); }
      .card:hover::before { opacity:1; }
      .card-icon { font-size:30px; margin-bottom:16px; }
      .card h3 { font:700 19px 'Space Grotesk'; margin-bottom:10px; }
      .card p { color:var(--muted); font-size:13.5px; line-height:1.75; }

      /* PRODUCT GRID */
      .prod-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
      .prod-card {
        background:var(--bg2); border:1px solid var(--border-light); border-radius:20px;
        overflow:hidden; transition:all .35s; cursor:pointer;
      }
      .prod-card:hover { transform:translateY(-8px); border-color:rgba(255,42,75,.4); box-shadow:0 24px 50px rgba(0,0,0,.6); }
      .prod-img {
        width:100%; aspect-ratio:1/1;
        display:flex; align-items:center; justify-content:center;
        font-size:72px; position:relative; overflow:hidden;
      }
      .prod-body { padding:22px 24px; }
      .prod-name { font:700 18px 'Space Grotesk'; margin-bottom:6px; }
      .prod-desc { color:var(--muted); font-size:12.5px; margin-bottom:16px; line-height:1.6; }
      .prod-footer { display:flex; align-items:center; justify-content:space-between; }
      .prod-price { font:800 22px 'Space Grotesk'; color:var(--red); }
      .add-btn {
        padding:9px 18px; border-radius:30px; border:none;
        background:var(--red); color:#fff; font:700 12px 'Space Grotesk';
        cursor:pointer; transition:all .3s;
      }
      .add-btn:hover { box-shadow:0 6px 20px rgba(255,42,75,.5); transform:scale(1.05); }
      .prod-tag {
        display:inline-block; padding:3px 10px; border-radius:20px;
        font:600 9px 'Space Grotesk'; letter-spacing:1.5px; margin-bottom:10px;
        background:rgba(255,42,75,.12); color:var(--red); border:1px solid rgba(255,42,75,.25);
      }

      /* ABOUT */
      .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:70px; align-items:center; }
      .about-visual {
        height:460px; border-radius:28px; border:1px solid var(--border);
        background:linear-gradient(135deg,var(--bg3),var(--bg2));
        display:flex; align-items:center; justify-content:center;
        font-size:140px; position:relative; overflow:hidden;
      }
      .about-visual::before {
        content:''; position:absolute; width:300px; height:300px;
        background:var(--red); border-radius:50%; filter:blur(100px); opacity:.08;
      }
      .about-copy p { color:var(--muted); line-height:1.9; font-size:14.5px; margin-bottom:18px; }
      .skill-tags { display:flex; flex-wrap:wrap; gap:10px; margin-top:28px; }
      .skill-tag {
        padding:8px 18px; border:1px solid var(--border-light); border-radius:30px;
        font:600 12px 'Space Grotesk'; color:#c8cad8;
        background:rgba(255,255,255,.03); transition:.3s;
      }
      .skill-tag:hover { border-color:var(--red); color:#fff; background:rgba(255,42,75,.08); }

      /* CONTACT */
      .contact-wrap {
        background:linear-gradient(135deg,rgba(255,42,75,.06),var(--bg3));
        border:1px solid rgba(255,42,75,.25); border-radius:28px;
        padding:64px 70px; display:grid; grid-template-columns:1.2fr .8fr; gap:70px; align-items:center;
      }
      .contact-wrap h2 { font:700 38px 'Space Grotesk'; margin-bottom:18px; }
      .contact-wrap h2 em { color:var(--red); font-style:normal; }
      .contact-info { display:flex; flex-direction:column; gap:14px; margin-bottom:36px; }
      .contact-item { display:flex; align-items:center; gap:14px; color:var(--muted); font-size:14px; }
      .contact-icon { width:40px; height:40px; border-radius:12px; background:rgba(255,42,75,.12); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
      .form-group { margin-bottom:18px; }
      .form-group label { display:block; font:600 12px 'Space Grotesk'; color:var(--muted); letter-spacing:1px; margin-bottom:8px; }
      .form-group input, .form-group textarea {
        width:100%; background:var(--bg2); border:1px solid var(--border-light);
        border-radius:12px; padding:13px 16px; color:#fff; font:500 14px 'Inter';
        outline:none; transition:.3s; resize:none;
      }
      .form-group input:focus, .form-group textarea:focus { border-color:var(--red); box-shadow:0 0 0 3px rgba(255,42,75,.1); }
      .form-group textarea { height:120px; }

      /* FOOTER */
      footer {
        border-top:1px solid var(--border-light); padding:32px 6%;
        display:flex; align-items:center; justify-content:space-between;
        color:var(--muted); font-size:13px;
      }
      footer span { color:var(--red); }

      /* PAGE TRANSITION */
      .page-enter { animation: fadeUp .45s ease forwards; }
      @keyframes fadeUp { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }

      /* TOAST */
      .toast {
        position:fixed; bottom:30px; right:30px; z-index:9999;
        background:linear-gradient(135deg,#0d0f18,#13151f);
        border:1px solid rgba(255,42,75,.4); border-radius:16px;
        padding:16px 24px; display:flex; align-items:center; gap:12px;
        color:#fff; font:600 14px 'Space Grotesk'; box-shadow:0 20px 50px rgba(0,0,0,.6);
        animation: slideIn .4s ease;
      }
      @keyframes slideIn { from{transform:translateX(120px);opacity:0;} to{transform:translateX(0);opacity:1;} }

      /* BADGE */
      .badge {
        display:inline-flex; align-items:center; justify-content:center;
        min-width:20px; height:20px; border-radius:10px;
        background:var(--red); color:#fff; font:700 11px 'Space Grotesk';
        padding:0 6px; margin-left:6px;
      }

      /* HERO FLOATING TAGS */
      .float-tags { display:flex; gap:12px; flex-wrap:wrap; margin-top:36px; }
      .float-tag {
        padding:8px 16px; background:rgba(9,10,14,.85); border:1px solid var(--border);
        backdrop-filter:blur(12px); border-radius:30px; font-size:12px; color:#c8cad8;
        box-shadow:0 6px 20px rgba(0,0,0,.4); animation:floatY 4s ease-in-out infinite;
      }
      .float-tag:nth-child(2){animation-delay:.5s;}
      .float-tag:nth-child(3){animation-delay:1s;}
      @keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}

      @media(max-width:900px){
        .grid-3{grid-template-columns:1fr 1fr;}
        .grid-4{grid-template-columns:1fr 1fr;}
        .prod-grid{grid-template-columns:1fr 1fr;}
        .about-grid{grid-template-columns:1fr;}
        .contact-wrap{grid-template-columns:1fr; padding:40px 32px;}
        .nav-links a{padding:7px 12px; font-size:12px;}
      }
      @media(max-width:600px){
        .grid-3,.grid-4,.prod-grid{grid-template-columns:1fr;}
        .stats-row{gap:24px;}
        .section{padding:80px 5%;}
        .hero{padding:90px 5% 50px;}
        footer{flex-direction:column;gap:10px;text-align:center;}
        .contact-wrap{padding:30px 24px;}
        .nav-links{gap:4px;}
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

/* ═══════════════════════════════════════════
   NAV COMPONENT
═══════════════════════════════════════════ */
function Navbar({ cartCount }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="nav-brand">
        <span>&lt;/&gt;</span> TechStore
      </Link>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
        <Link to="/shop" className={location.pathname.startsWith('/shop') || location.pathname.startsWith('/product') ? 'active' : ''}>Shop</Link>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
        <Link to="/shop" className="cart-btn">
          🛒 Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════ */
function Home() {
  return (
    <div className="page-enter">
      {/* HERO */}
      <section className="hero">
        <div className="hero-blob" style={{ width:600, height:600, background:'#ff2a4b', opacity:.07, right:'-5%', top:'-10%' }} />
        <div className="hero-blob" style={{ width:400, height:400, background:'#8a2be2', opacity:.06, left:'-5%', bottom:'0' }} />
        <div className="hero-content">
          <div className="eyebrow">⚡ REACT + VITE POWERED PLATFORM</div>
          <h1>Premium Tech<br /><em>Products Store</em></h1>
          <p className="hero-sub">
            Explore our curated collection of top-tier tech gadgets, developer tools, and digital accessories — built for creators and engineers.
          </p>
          <div className="btn-group">
            <Link to="/shop" className="btn btn-primary">Shop Now →</Link>
            <Link to="/about" className="btn btn-ghost">Learn More</Link>
          </div>
          <div className="float-tags">
            <span className="float-tag">⚛ React.js</span>
            <span className="float-tag">⚡ Vite</span>
            <span className="float-tag">🛒 E-Commerce</span>
          </div>
          <div className="stats-row">
            <div className="stat">
              <div className="stat-n">50<span>+</span></div>
              <div className="stat-l">PRODUCTS</div>
            </div>
            <div className="stat">
              <div className="stat-n">2K<span>+</span></div>
              <div className="stat-l">CUSTOMERS</div>
            </div>
            <div className="stat">
              <div className="stat-n">4.9<span>★</span></div>
              <div className="stat-l">RATING</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="section-head">
          <span className="sec-num">01</span>
          <span className="sec-label">WHY CHOOSE US</span>
          <h2>Built for <em>developers</em> &amp; creators.</h2>
        </div>
        <div className="grid-3">
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'All products optimized for speed — curated by engineers for engineers.' },
            { icon: '🔒', title: 'Secure Checkout', desc: 'End-to-end encrypted transactions with multiple payment methods supported.' },
            { icon: '🚀', title: 'Free Shipping', desc: 'Free delivery on all orders above PKR 5,000. Nationwide coverage.' },
            { icon: '♻️', title: '30-Day Returns', desc: 'Not satisfied? Return within 30 days for a full refund — no questions asked.' },
            { icon: '💬', title: '24/7 Support', desc: 'Round-the-clock customer support via live chat, email, and WhatsApp.' },
            { icon: '🏆', title: 'Premium Quality', desc: 'Every product is tested and verified before listing on our platform.' },
          ].map((f, i) => (
            <div className="card" key={i}>
              <div className="card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section" style={{ borderTop: '1px solid rgba(255,255,255,.05)' }}>
        <div className="section-head">
          <span className="sec-num">02</span>
          <span className="sec-label">FEATURED PICKS</span>
          <h2>Best <em>selling</em> products.</h2>
        </div>
        <div className="prod-grid">
          {PRODUCTS.slice(0, 3).map(p => (
            <Link to={`/product/${p.id}`} key={p.id} className="prod-card">
              <div className="prod-img">
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="prod-body">
                <div className="prod-tag">{p.tag}</div>
                <div className="prod-name">{p.name}</div>
                <div className="prod-desc">{p.desc}</div>
                <div className="prod-footer">
                  <div className="prod-price">PKR {p.price.toLocaleString()}</div>
                  <button className="add-btn">View →</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <Link to="/shop" className="btn btn-primary">View All Products →</Link>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRODUCTS DATA
═══════════════════════════════════════════ */
const PRODUCTS = [
  { id: 1, name: 'Pro Mechanical Keyboard', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', price: 12500, tag: 'BEST SELLER', desc: 'RGB mechanical keyboard with Cherry MX switches. 100% anti-ghosting.', cat: 'peripherals' },
  { id: 2, name: 'Gaming Mouse X900', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', price: 8900, tag: 'TOP RATED', desc: '16000 DPI optical sensor. Programmable 8 buttons. Ergonomic design.', cat: 'peripherals' },
  { id: 3, name: 'UltraWide 4K Monitor', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80', price: 89000, tag: 'PREMIUM', desc: '34" ultrawide 4K IPS. 144Hz refresh. HDR 600 support.', cat: 'displays' },
  { id: 4, name: 'Dev Laptop Stand', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80', price: 3500, tag: 'POPULAR', desc: 'Aluminum laptop stand. Adjustable height. MacBook & PC compatible.', cat: 'accessories' },
  { id: 5, name: 'USB-C Hub Pro', image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=600&q=80', price: 5200, tag: 'NEW ARRIVAL', desc: '12-in-1 USB-C dock with HDMI, 4K@60Hz, 100W PD charging.', cat: 'accessories' },
  { id: 6, name: 'Noise Cancelling Headset', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', price: 22000, tag: "EDITOR'S PICK", desc: 'Active noise cancellation. 30hr battery. Crystal clear mic.', cat: 'audio' },
  { id: 7, name: 'Portable SSD 1TB', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80', price: 15000, tag: 'FAST DELIVERY', desc: 'NVMe portable SSD. 1050 MB/s read speed. USB 3.2 Gen 2.', cat: 'storage' },
  { id: 8, name: 'Webcam 4K Ultra', image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=600&q=80', price: 18000, tag: 'WORK FROM HOME', desc: '4K 30fps webcam. Auto light correction. Ring fill light included.', cat: 'peripherals' },
  { id: 9, name: 'Desk LED Light Bar', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80', price: 2800, tag: 'POPULAR', desc: 'Smart LED monitor light bar. USB powered. No screen glare.', cat: 'accessories' },
];

/* ═══════════════════════════════════════════
   SHOP PAGE
═══════════════════════════════════════════ */
function Shop({ onAddToCart }) {
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const cats = ['all', 'peripherals', 'displays', 'accessories', 'audio', 'storage'];
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);

  const handleAdd = (p, e) => {
    e.preventDefault();
    onAddToCart(p);
    setToast(`✅ ${p.name} added to cart!`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="page-enter">
      <section className="section" style={{ paddingTop: 120 }}>
        <div className="section-head">
          <span className="sec-num">03</span>
          <span className="sec-label">ALL PRODUCTS</span>
          <h2>Our <em>complete</em> collection.</h2>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '9px 20px', borderRadius: 30, border: `1px solid ${filter === c ? 'transparent' : 'rgba(255,255,255,.08)'}`,
              background: filter === c ? '#ff2a4b' : 'rgba(255,255,255,.03)', color: filter === c ? '#fff' : '#8a8f9e',
              font: '700 11px Space Grotesk, sans-serif', letterSpacing: '1.5px', cursor: 'pointer', textTransform: 'uppercase',
              transition: 'all .3s', boxShadow: filter === c ? '0 6px 20px rgba(255,42,75,.35)' : 'none',
            }}>
              {c}
            </button>
          ))}
        </div>

        <div className="prod-grid">
          {filtered.map(p => (
            <Link to={`/product/${p.id}`} key={p.id} className="prod-card">
              <div className="prod-img">
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="prod-body">
                <div className="prod-tag">{p.tag}</div>
                <div className="prod-name">{p.name}</div>
                <div className="prod-desc">{p.desc}</div>
                <div className="prod-footer">
                  <div className="prod-price">PKR {p.price.toLocaleString()}</div>
                  <button className="add-btn" onClick={(e) => handleAdd(p, e)}>Add to Cart</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {toast && <div className="toast">🛒 {toast}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRODUCT DETAIL PAGE
═══════════════════════════════════════════ */
function ProductDetail({ onAddToCart }) {
  const location = useLocation();
  const id = parseInt(location.pathname.split('/').pop());
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
  const [toast, setToast] = useState(false);

  const handleAdd = () => {
    onAddToCart(p);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="page-enter">
      <section className="section" style={{ paddingTop: 120 }}>
        <Link to="/shop" style={{ color: '#8a8f9e', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40, fontWeight: 600 }}>← Back to Shop</Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div className="about-visual" style={{ padding: 0, overflow: 'hidden', height: 380 }}>
            <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }} />
          </div>
          <div>
            <div className="prod-tag">{p.tag}</div>
            <h1 style={{ font: '800 38px Space Grotesk, sans-serif', margin: '14px 0 18px', lineHeight: 1.1 }}>{p.name}</h1>
            <p style={{ color: '#8a8f9e', lineHeight: 1.85, fontSize: 15, marginBottom: 24 }}>{p.desc} Premium build quality with a 1-year manufacturer warranty included. Compatible with all major operating systems.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
              <span style={{ font: '800 40px Space Grotesk', color: '#ff2a4b' }}>PKR {p.price.toLocaleString()}</span>
              <span style={{ color: '#505367', font: '600 13px Inter', textDecoration: 'line-through' }}>PKR {(p.price * 1.2).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
              <button className="add-btn" style={{ padding: '14px 32px', borderRadius: 12, fontSize: 14 }} onClick={handleAdd}>🛒 Add to Cart</button>
              <button className="btn btn-ghost" style={{ padding: '14px 24px', font: '700 13px Space Grotesk', borderRadius: 12 }}>♡ Wishlist</button>
            </div>
            <div style={{ padding: '22px 26px', background: 'rgba(255,42,75,.05)', border: '1px solid rgba(255,42,75,.2)', borderRadius: 14 }}>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {['⚡ Fast Delivery', '🔒 Secure Payment', '♻️ Easy Returns', '🏆 Authentic'].map(item => (
                  <span key={item} style={{ font: '600 12px Space Grotesk', color: '#c8cad8' }}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {toast && <div className="toast">✅ {p.name} added to cart!</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════ */
function About() {
  return (
    <div className="page-enter">
      <section className="section" style={{ paddingTop: 120 }}>
        <div className="section-head">
          <span className="sec-num">04</span>
          <span className="sec-label">ABOUT US</span>
          <h2>Built by devs, <em>for devs.</em></h2>
        </div>
        <div className="about-grid">
          <div className="about-visual">💻</div>
          <div className="about-copy">
            <p>TechStore is a curated e-commerce platform designed for developers, engineers, and digital creators. We hand-pick every product to ensure it meets the highest standards of quality and performance.</p>
            <p>This project is built with <strong style={{ color: '#fff' }}>React.js + Vite</strong> as a modern SPA (Single Page Application), featuring client-side routing, dynamic rendering, and reusable component architecture.</p>
            <p>Stack used: React 18, React Router v6, Vite, ES6+ JavaScript, and modern CSS with glassmorphism design principles.</p>
            <div className="skill-tags">
              {['React.js', 'React Router v6', 'Vite', 'JavaScript ES6+', 'CSS3', 'Component Architecture', 'State Management', 'Responsive Design'].map(s => (
                <span className="skill-tag" key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid rgba(255,255,255,.05)' }}>
        <div className="section-head">
          <span className="sec-num">05</span>
          <span className="sec-label">TEAM</span>
          <h2>The people <em>behind it.</em></h2>
        </div>
        <div className="grid-3">
          {[
            { emoji: '👨‍💻', name: 'Abdul Rehman', role: 'Lead Developer', desc: 'Full Stack Developer specializing in React, JavaScript and Java.' },
            { emoji: '🎨', name: 'UI Designer', role: 'Design Lead', desc: 'Crafting beautiful and intuitive interfaces for modern web platforms.' },
            { emoji: '⚙️', name: 'Backend Engineer', role: 'Systems Architect', desc: 'Building robust APIs and scalable backend infrastructure.' },
          ].map((m, i) => (
            <div className="card" key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 60, marginBottom: 18 }}>{m.emoji}</div>
              <h3 style={{ marginBottom: 4 }}>{m.name}</h3>
              <div style={{ color: '#ff2a4b', font: '700 11px Space Grotesk', letterSpacing: '1.5px', marginBottom: 14 }}>{m.role}</div>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════ */
function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
    setForm({ name: '', email: '', msg: '' });
  };
  return (
    <div className="page-enter">
      <section className="section" style={{ paddingTop: 120 }}>
        <div className="section-head">
          <span className="sec-num">06</span>
          <span className="sec-label">CONTACT</span>
          <h2>Let's build something <em>great.</em></h2>
        </div>
        <div className="contact-wrap">
          <div>
            <h2>Get in <em>touch.</em></h2>
            <p style={{ color: '#8a8f9e', lineHeight: 1.85, marginBottom: 32, fontSize: 14.5 }}>
              Have questions about a product, custom order, or want to collaborate? We're available 24/7 and will respond within 2 hours.
            </p>
            <div className="contact-info">
              {[
                { icon: '📞', label: '+92 318 3707098' },
                { icon: '✉️', label: 'abdulrehmannadeem705@gmail.com' },
                { icon: '📍', label: 'Karachi, Pakistan' },
                { icon: '🕐', label: 'Mon–Sat, 9am–9pm PKT' },
              ].map((c, i) => (
                <div className="contact-item" key={i}>
                  <div className="contact-icon">{c.icon}</div>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>YOUR NAME</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Abdul Rehman" required />
            </div>
            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>MESSAGE</label>
              <textarea value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} placeholder="Tell us about your requirements..." required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {sent ? '✅ Message Sent!' : 'Send Message →'}
            </button>
          </form>
        </div>
      </section>
      {sent && <div className="toast">✅ Message sent! We'll reply within 2 hours.</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
function Footer() {
  return (
    <footer>
      <span>© 2026 <span>TechStore</span> — Built with ⚛ React + Vite</span>
      <span>By <span>Abdul Rehman</span> | Karachi, Pakistan</span>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════ */
export default function App() {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => setCart(prev => [...prev, product]);

  return (
    <Router>
      <GlobalStyle />
      <Navbar cartCount={cart.length} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop onAddToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}

