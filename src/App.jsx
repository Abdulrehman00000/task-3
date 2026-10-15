import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

/* ═══════════════════════════════════════════
   AUDIO FX ENGINE (Web Audio API)
═══════════════════════════════════════════ */
const playAudioFx = (type = 'click') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'add') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } else if (type === 'success') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.35);
      });
    }
  } catch (e) {}
};

/* ═══════════════════════════════════════════
   GLOBAL STYLES & CYBER-NEON AESTHETICS
═══════════════════════════════════════════ */
const GlobalStyle = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'techstore-global-styles';
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --red: #ff2a4b;
        --red-glow: rgba(255, 42, 75, 0.45);
        --red-subtle: rgba(255, 42, 75, 0.08);
        --cyan: #00f0ff;
        --cyan-glow: rgba(0, 240, 255, 0.35);
        --bg: #06070a;
        --bg2: #0c0e14;
        --bg3: #121520;
        --card-bg: rgba(14, 17, 26, 0.85);
        --border: rgba(255, 255, 255, 0.08);
        --border-hover: rgba(255, 42, 75, 0.4);
        --text: #f3f4f8;
        --muted: #8b90a4;
        --gold: #f59e0b;
      }
      html { scroll-behavior: smooth; }
      body {
        background: var(--bg);
        color: var(--text);
        font-family: 'Plus Jakarta Sans', sans-serif;
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
      }
      a { text-decoration: none; color: inherit; }
      button { font-family: inherit; }

      /* SCROLLBAR */
      ::-webkit-scrollbar { width: 7px; }
      ::-webkit-scrollbar-track { background: var(--bg); }
      ::-webkit-scrollbar-thumb { background: #1c202d; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--red); }

      /* UTILITIES */
      .font-mono { font-family: 'JetBrains Mono', monospace; }
      .font-space { font-family: 'Space Grotesk', sans-serif; }

      /* NAVBAR */
      .nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 900;
        height: 74px; display: flex; align-items: center; justify-content: space-between;
        padding: 0 5%; background: rgba(6, 7, 10, 0.85);
        backdrop-filter: blur(20px); border-bottom: 1px solid var(--border);
        transition: all .3s;
      }
      .nav.scrolled {
        background: rgba(6, 7, 10, 0.98);
        border-bottom-color: rgba(255, 42, 75, 0.2);
        box-shadow: 0 10px 40px rgba(0,0,0,0.8);
      }
      .nav-brand {
        display: flex; align-items: center; gap: 10px;
        font: 800 22px 'Space Grotesk'; letter-spacing: -0.5px;
      }
      .nav-logo-box {
        width: 36px; height: 36px; border-radius: 10px;
        background: linear-gradient(135deg, var(--red), #b91c1c);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 0 20px var(--red-glow);
        font-size: 16px; font-weight: 800; color: #fff;
      }
      .nav-links { display: flex; align-items: center; gap: 6px; }
      .nav-item {
        padding: 8px 16px; border-radius: 20px;
        font: 600 13px 'Space Grotesk'; color: var(--muted);
        transition: all .25s;
      }
      .nav-item:hover { color: #fff; background: rgba(255,255,255,0.04); }
      .nav-item.active {
        color: #fff; background: var(--red-subtle);
        border: 1px solid rgba(255, 42, 75, 0.3);
      }

      /* BUTTONS */
      .btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        padding: 12px 24px; border-radius: 12px; font: 700 13.5px 'Space Grotesk';
        transition: all .25s; cursor: pointer; border: none; outline: none;
      }
      .btn-primary {
        background: var(--red); color: #fff;
        box-shadow: 0 8px 25px var(--red-glow);
      }
      .btn-primary:hover {
        transform: translateY(-2px); box-shadow: 0 14px 35px var(--red-glow);
      }
      .btn-ghost {
        background: rgba(255,255,255,0.04); color: var(--text);
        border: 1px solid var(--border);
      }
      .btn-ghost:hover {
        border-color: var(--red); color: #fff; background: var(--red-subtle);
        transform: translateY(-2px);
      }

      /* PRODUCT CARDS */
      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        gap: 24px;
      }
      .prod-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 18px; overflow: hidden;
        display: flex; flex-direction: column;
        transition: all .35s cubic-bezier(0.2, 0.8, 0.2, 1);
        position: relative;
      }
      .prod-card:hover {
        transform: translateY(-6px);
        border-color: var(--border-hover);
        box-shadow: 0 20px 45px rgba(0,0,0,0.6), 0 0 30px rgba(255, 42, 75, 0.12);
      }
      .prod-img-box {
        position: relative; width: 100%; aspect-ratio: 4/3;
        overflow: hidden; background: #0a0c12;
      }
      .prod-img-box img {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform .5s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .prod-card:hover .prod-img-box img {
        transform: scale(1.06);
      }
      .prod-tag-badge {
        position: absolute; top: 12px; left: 12px; z-index: 2;
        padding: 4px 10px; border-radius: 20px;
        font: 700 10px 'Space Grotesk'; letter-spacing: 1px;
        background: rgba(6, 7, 10, 0.8); backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 42, 75, 0.4); color: #ff6b81;
      }
      .wishlist-btn {
        position: absolute; top: 12px; right: 12px; z-index: 2;
        width: 34px; height: 34px; border-radius: 50%;
        background: rgba(6, 7, 10, 0.7); backdrop-filter: blur(8px);
        border: 1px solid var(--border); color: #fff;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all .2s; font-size: 15px;
      }
      .wishlist-btn:hover, .wishlist-btn.active {
        background: var(--red); border-color: var(--red); color: #fff;
        transform: scale(1.1); box-shadow: 0 0 15px var(--red-glow);
      }

      /* TOAST */
      .toast-wrap {
        position: fixed; bottom: 28px; right: 28px; z-index: 10000;
        display: flex; flex-direction: column; gap: 10px; pointer-events: none;
      }
      .toast {
        background: rgba(18, 21, 32, 0.95);
        border: 1px solid rgba(255, 42, 75, 0.4);
        padding: 14px 22px; border-radius: 12px; color: #fff;
        box-shadow: 0 12px 35px rgba(0,0,0,0.8), 0 0 25px rgba(255, 42, 75, 0.25);
        font: 600 13px 'Plus Jakarta Sans'; display: flex; align-items: center; gap: 10px;
        animation: toastIn .3s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      @keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

      /* MODAL & DRAWER */
      .drawer-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.75);
        backdrop-filter: blur(10px); z-index: 2000;
        animation: fadeIn .25s ease;
      }
      .drawer {
        position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 440px;
        background: #0b0d14; border-left: 1px solid var(--border);
        z-index: 2001; display: flex; flex-direction: column;
        box-shadow: -15px 0 50px rgba(0,0,0,0.9);
        animation: slideLeft .3s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

      /* MODAL POPUP */
      .modal-box {
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 90%; max-width: 620px; background: #0c0e16;
        border: 1px solid rgba(255, 42, 75, 0.35); border-radius: 24px;
        padding: 32px; z-index: 2005; box-shadow: 0 25px 70px rgba(0,0,0,0.95);
        animation: popModal .3s cubic-bezier(0.2, 0.8, 0.2, 1);
        max-height: 90vh; overflow-y: auto;
      }
      @keyframes popModal { from { transform: translate(-50%, -46%) scale(0.95); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }

      /* RESPONSIVE */
      @media (max-width: 768px) {
        .nav-links .nav-text { display: none; }
        .hero-title { font-size: 36px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById('techstore-global-styles');
      if (el) el.remove();
    };
  }, []);
  return null;
};

/* ═══════════════════════════════════════════
   PREMIUM TECH PRODUCTS DATABASE (12 ITEMS)
═══════════════════════════════════════════ */
const PRODUCTS = [
  {
    id: 1,
    name: 'CyberBlade Pro Mechanical Keyboard',
    category: 'Peripherals',
    price: 13500,
    originalPrice: 16500,
    tag: 'BEST SELLER',
    rating: 4.9,
    reviews: 218,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    specs: ['Cherry MX Red Switches', 'South-Facing Per-Key RGB', 'Hot-Swappable PCB', 'CNC Aluminum Chassis'],
    desc: 'Bespoke high-performance wireless mechanical keyboard with ultra-low 1ms latency, sound-dampening silicone gaskets, and custom PBT keycaps.',
    stock: 12
  },
  {
    id: 2,
    name: 'Vortex Viper X900 Ultralight Gaming Mouse',
    category: 'Peripherals',
    price: 8900,
    originalPrice: 11000,
    tag: 'TOP RATED',
    rating: 4.8,
    reviews: 164,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    specs: ['26,000 DPI PAW3395 Sensor', '58g Featherweight Shell', 'Optical Switches (90M Clicks)', 'HyperFlex Paracord'],
    desc: 'Engineered for tournament precision with pure PTFE glide skates and zero sensor smoothing across all sensitivity levels.',
    stock: 19
  },
  {
    id: 3,
    name: 'Horizon 38" Curved 4K HDR Monitor',
    category: 'Displays',
    price: 94000,
    originalPrice: 115000,
    tag: 'PREMIUM',
    rating: 5.0,
    reviews: 82,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    specs: ['3840x1600 Ultrawide IPS', '165Hz Refresh · 1ms GtG', 'DisplayHDR 600 Certified', '90W USB-C Single Cable Hub'],
    desc: 'Cinema-grade ultra-wide panoramic workstation display featuring 98% DCI-P3 color reproduction and factory hardware calibration.',
    stock: 4
  },
  {
    id: 4,
    name: 'Apex Studio Aluminum Laptop Ergonomic Stand',
    category: 'Accessories',
    price: 4200,
    originalPrice: 5500,
    tag: 'ESSENTIAL',
    rating: 4.7,
    reviews: 310,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    specs: ['Solid Anodized Aerospace Alloy', 'Dual Articulating Hinges', 'Silicone Anti-Slip Padding', 'Passive Heat Dissipation'],
    desc: 'Elevate your posture and workflow. Foldable design supporting all 11"-17" MacBooks and Windows ultrabooks with zero wobble.',
    stock: 25
  },
  {
    id: 5,
    name: 'HyperDock 14-in-1 Dual 4K USB-C Hub',
    category: 'Accessories',
    price: 6800,
    originalPrice: 8500,
    tag: 'NEW ARRIVAL',
    rating: 4.9,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80',
    specs: ['Dual HDMI 4K@60Hz + DisplayPort', '100W USB-C Power Delivery', 'Gigabit RJ45 Ethernet', 'SD / TF UHS-II Readers'],
    desc: 'Turn a single USB-C port into a full workstation. Seamless driver-free connectivity for M1/M2/M3 Macs and modern laptops.',
    stock: 14
  },
  {
    id: 6,
    name: 'AcousticPulse ANC Wireless Studio Headset',
    category: 'Audio',
    price: 24500,
    originalPrice: 29000,
    tag: "EDITOR'S CHOICE",
    rating: 4.9,
    reviews: 147,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    specs: ['Hybrid Active Noise Cancelling', '40mm Beryllium Drivers', '42-Hour Fast-Charge Battery', 'LDAC & aptX HD Hi-Res'],
    desc: 'Immersive sound insulation engineered for deep focus. Memory foam lambskin earcups and spatial audio acoustic chamber.',
    stock: 7
  },
  {
    id: 7,
    name: 'TitanBolt 2TB Rugged NVMe Portable SSD',
    category: 'Storage',
    price: 26000,
    originalPrice: 32000,
    tag: 'FAST SPEEDS',
    rating: 4.8,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    specs: ['2050 MB/s Read & Write Speed', 'USB 3.2 Gen 2x2 Type-C', 'IP67 Water & Dust Resistance', '256-bit AES Hardware Crypt'],
    desc: 'Pocket-sized blistering external storage for 4K/8K video editing, game libraries, and high-security encrypted data backups.',
    stock: 11
  },
  {
    id: 8,
    name: 'LumixView 4K Ultra-Wide Streamer Webcam',
    category: 'Peripherals',
    price: 19500,
    originalPrice: 23000,
    tag: 'CREATOR PICK',
    rating: 4.7,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=800&q=80',
    specs: ['Sony STARVIS 4K Sensor', 'Smart Dual AI Face Tracking', 'Built-in Adjustable Ring Light', 'Dual Stereo Noise-Cancel Mics'],
    desc: 'Broadcast-quality 4K 60fps streaming camera. Delivers razor-sharp clarity in low-light environments without complex lighting rigs.',
    stock: 9
  },
  {
    id: 9,
    name: 'HaloGlow ScreenBar Smart Monitor Light',
    category: 'Accessories',
    price: 3600,
    originalPrice: 4500,
    tag: 'POPULAR',
    rating: 4.8,
    reviews: 240,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    specs: ['Asymmetrical Optical Path', 'Zero Screen Glare Design', 'Wireless Touch Puck Control', 'Stepless Dimming 2700K-6500K'],
    desc: 'Saves valuable desk space while eliminating digital eye strain during late-night coding and design sessions.',
    stock: 22
  },
  {
    id: 10,
    name: 'Zephyrus Studio Desktop Microphone',
    category: 'Audio',
    price: 16500,
    originalPrice: 19800,
    tag: 'STUDIO GRADE',
    rating: 4.9,
    reviews: 130,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    specs: ['24-bit/192kHz Condenser Capsule', 'Zero-Latency Monitoring 3.5mm', 'Cardioid & Omnidirectional Modes', 'Built-in Shockmount & Pop Filter'],
    desc: 'Warm, podcast-ready broadcast vocal capture with physical gain knob and quick-tap touch capacitive mute indicator.',
    stock: 8
  },
  {
    id: 11,
    name: 'CyberPad RGB Giant Precision Desk Mat',
    category: 'Accessories',
    price: 2600,
    originalPrice: 3500,
    tag: 'HOT DEAL',
    rating: 4.6,
    reviews: 412,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    specs: ['900x400x4mm Extra Large Area', 'Micro-Woven Waterproof Fabric', '14 Chroma Dynamic RGB Modes', 'Anti-Fray Precision Stitching'],
    desc: 'Silky micro-textured surface optimized for rapid flick shots and smooth mouse tracking while framing your entire setup in vibrant light.',
    stock: 35
  },
  {
    id: 12,
    name: 'VoltStream 140W GaN Fast Charger',
    category: 'Accessories',
    price: 7900,
    originalPrice: 9900,
    tag: 'COMPACT',
    rating: 4.9,
    reviews: 175,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    specs: ['GaN III Semiconductor Technology', '3x USB-C + 1x USB-A Ports', 'Charges MacBook Pro 16" to 50% in 30min', 'Full Safety Thermal Protection'],
    desc: 'One palm-sized charger for your entire travel bag. High-efficiency power allocation keeps all laptops, phones, and devices fast-charged.',
    stock: 16
  }
];

const CATEGORIES = ['All', 'Peripherals', 'Displays', 'Audio', 'Storage', 'Accessories'];

/* ═══════════════════════════════════════════
   MAIN APP WITH DYNAMIC STATE
═══════════════════════════════════════════ */
export default function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Toast Dispatcher
  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  };

  // Cart Management
  const addToCart = (product, qty = 1) => {
    playAudioFx('add');
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    showToast(`🛒 ${product.name} added to Bag`);
  };

  const updateQuantity = (id, delta) => {
    playAudioFx('click');
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    playAudioFx('click');
    setCart(prev => prev.filter(item => item.id !== id));
    showToast('Removed item from Bag');
  };

  // Wishlist Management
  const toggleWishlist = (product) => {
    playAudioFx('click');
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`♡ Removed ${product.name} from Wishlist`);
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`❤️ Added ${product.name} to Wishlist`);
        return [...prev, product];
      }
    });
  };

  // Promo Code Validation
  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'TECH10') {
      playAudioFx('success');
      setDiscountPercent(10);
      showToast('🎉 Promo TECH10 applied: 10% Discount!');
    } else {
      showToast('❌ Invalid code. Try "TECH10" for 10% off');
    }
  };

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const shippingFee = subtotal > 10000 || subtotal === 0 ? 0 : 450;
  const grandTotal = subtotal - discountAmount + shippingFee;
  const freeShippingThreshold = 10000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <Router>
      <GlobalStyle />

      {/* NAVBAR */}
      <Navbar
        cartCount={cart.reduce((n, i) => n + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* MAIN ROUTES */}
      <main style={{ minHeight: '80vh', paddingTop: 74 }}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                products={PRODUCTS}
                onAddToCart={addToCart}
                onQuickView={setQuickViewProduct}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <ShopPage
                products={PRODUCTS}
                onAddToCart={addToCart}
                onQuickView={setQuickViewProduct}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetailPage
                products={PRODUCTS}
                onAddToCart={addToCart}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage showToast={showToast} />} />
          <Route
            path="*"
            element={
              <HomePage
                products={PRODUCTS}
                onAddToCart={addToCart}
                onQuickView={setQuickViewProduct}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
              />
            }
          />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* SLIDE-OUT CART DRAWER */}
      {isCartOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setIsCartOpen(false)} />
          <div className="drawer">
            <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ font: '800 20px Space Grotesk' }}>Shopping Bag</span>
                <span style={{ background: 'var(--red)', color: '#fff', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                  {cart.reduce((n, i) => n + i.quantity, 0)}
                </span>
              </div>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Free Shipping Meter */}
            <div style={{ padding: '14px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                <span>{subtotal >= freeShippingThreshold ? '🎉 You unlocked FREE Shipping!' : `Add PKR ${(freeShippingThreshold - subtotal).toLocaleString()} for Free Delivery`}</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{progressPercent}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--red), var(--cyan))', transition: 'width .3s' }} />
              </div>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                  <div style={{ fontSize: 50, marginBottom: 14 }}>🛒</div>
                  <div style={{ font: '700 18px Space Grotesk', color: '#fff', marginBottom: 8 }}>Your Bag is Empty</div>
                  <p style={{ fontSize: 13, marginBottom: 20 }}>Explore our tech collection and find your dream setup gear.</p>
                  <button onClick={() => setIsCartOpen(false)} className="btn btn-primary">Start Shopping →</button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 14, background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 14, border: '1px solid var(--border)' }}>
                    <img src={item.image} alt={item.name} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 10 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ font: '700 13.5px Space Grotesk', color: '#fff', marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                      <div style={{ color: 'var(--red)', fontWeight: 800, fontSize: 14, marginBottom: 8 }}>
                        PKR {item.price.toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#07080d', padding: '4px 8px', borderRadius: 8, border: '1px solid var(--border)' }}>
                          <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 4px', fontSize: 14 }}>−</button>
                          <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0 4px', fontSize: 14 }}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: '#090a10' }}>
                <form onSubmit={applyPromo} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <input
                    type="text"
                    placeholder="Promo: TECH10"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: '#121520', border: '1px solid var(--border)', color: '#fff', font: '600 12px Space Grotesk' }}
                  />
                  <button type="submit" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 12 }}>Apply</button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span style={{ color: '#fff', fontWeight: 700 }}>PKR {subtotal.toLocaleString()}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                      <span>Discount ({discountPercent}%)</span>
                      <span>− PKR {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping</span>
                    <span style={{ color: shippingFee === 0 ? '#10b981' : '#fff' }}>
                      {shippingFee === 0 ? 'FREE' : `PKR ${shippingFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', font: '800 18px Space Grotesk', color: '#fff' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--red)' }}>PKR {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playAudioFx('click');
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '15px', borderRadius: 14, fontSize: 15 }}
                >
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* WISHLIST DRAWER */}
      {isWishlistOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setIsWishlistOpen(false)} />
          <div className="drawer">
            <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ font: '800 20px Space Grotesk' }}>My Wishlist</span>
                <span style={{ background: 'var(--red)', color: '#fff', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                  {wishlist.length}
                </span>
              </div>
              <button onClick={() => setIsWishlistOpen(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                  <div style={{ fontSize: 50, marginBottom: 14 }}>❤️</div>
                  <div style={{ font: '700 18px Space Grotesk', color: '#fff', marginBottom: 8 }}>Wishlist is Empty</div>
                  <p style={{ fontSize: 13 }}>Click the heart on any product to save it here for later.</p>
                </div>
              ) : (
                wishlist.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 14, background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 14, border: '1px solid var(--border)' }}>
                    <img src={item.image} alt={item.name} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 10 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ font: '700 13px Space Grotesk', color: '#fff', marginBottom: 4 }}>{item.name}</div>
                      <div style={{ color: 'var(--red)', fontWeight: 800, fontSize: 13, marginBottom: 8 }}>
                        PKR {item.price.toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => {
                            addToCart(item);
                            toggleWishlist(item);
                          }}
                          className="btn btn-primary"
                          style={{ padding: '6px 14px', fontSize: 11, borderRadius: 8 }}
                        >
                          Move to Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="btn btn-ghost"
                          style={{ padding: '6px 10px', fontSize: 11, borderRadius: 8 }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* QUICK VIEW PRODUCT MODAL */}
      {quickViewProduct && (
        <>
          <div className="drawer-overlay" onClick={() => setQuickViewProduct(null)} />
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ font: '700 12px Space Grotesk', letterSpacing: 2, color: 'var(--red)' }}>
                {quickViewProduct.category.toUpperCase()} · QUICK VIEW
              </span>
              <button onClick={() => setQuickViewProduct(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, alignItems: 'center' }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '1/1', background: '#0a0c12' }}>
                <img src={quickViewProduct.image} alt={quickViewProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ display: 'inline-block', background: 'rgba(255,42,75,0.1)', color: 'var(--red)', padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
                  {quickViewProduct.tag}
                </div>
                <h2 style={{ font: '800 24px Space Grotesk', color: '#fff', marginBottom: 10, lineHeight: 1.2 }}>
                  {quickViewProduct.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gold)', marginBottom: 14 }}>
                  <span>★★★★★</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{quickViewProduct.rating}</span>
                  <span style={{ color: 'var(--muted)' }}>({quickViewProduct.reviews} reviews)</span>
                </div>
                <div style={{ font: '800 28px Space Grotesk', color: 'var(--red)', marginBottom: 14 }}>
                  PKR {quickViewProduct.price.toLocaleString()}
                  <span style={{ fontSize: 15, color: 'var(--muted)', textDecoration: 'line-through', marginLeft: 10 }}>
                    PKR {quickViewProduct.originalPrice.toLocaleString()}
                  </span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>
                  {quickViewProduct.desc}
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '13px' }}
                  >
                    Add to Bag 🛒
                  </button>
                  <button
                    onClick={() => toggleWishlist(quickViewProduct)}
                    className="btn btn-ghost"
                    style={{ padding: '13px 18px' }}
                  >
                    {wishlist.some(w => w.id === quickViewProduct.id) ? '❤️' : '♡'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setIsCheckoutOpen(false)} />
          <div className="modal-box">
            {orderConfirmed ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
                <h2 style={{ font: '800 26px Space Grotesk', color: '#fff', marginBottom: 8 }}>Order Placed Successfully!</h2>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
                  Thank you, <strong style={{ color: '#fff' }}>{orderConfirmed.name}</strong>! Your order <strong style={{ color: 'var(--red)' }}>#{orderConfirmed.orderId}</strong> has been received and is being prepared.
                </p>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: 18, borderRadius: 14, marginBottom: 24, textAlign: 'left', fontSize: 13, lineHeight: 1.8 }}>
                  <div>📍 <strong>Address:</strong> {orderConfirmed.address}, {orderConfirmed.city}</div>
                  <div>📞 <strong>Phone:</strong> {orderConfirmed.phone}</div>
                  <div>💳 <strong>Payment Method:</strong> {orderConfirmed.method}</div>
                  <div>💰 <strong>Total Amount:</strong> PKR {orderConfirmed.total.toLocaleString()}</div>
                </div>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setOrderConfirmed(null);
                    setCart([]);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px' }}
                >
                  Done & Continue Shopping
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ font: '800 22px Space Grotesk', color: '#fff' }}>Complete Your Order</h2>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>Total: PKR {grandTotal.toLocaleString()}</span>
                  </div>
                  <button onClick={() => setIsCheckoutOpen(false)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer' }}>✕</button>
                </div>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    playAudioFx('success');
                    const formData = new FormData(e.target);
                    const orderData = {
                      orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
                      name: formData.get('name'),
                      phone: formData.get('phone'),
                      address: formData.get('address'),
                      city: formData.get('city'),
                      method: formData.get('paymentMethod'),
                      total: grandTotal
                    };
                    setOrderConfirmed(orderData);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, letterSpacing: 1 }}>FULL NAME</label>
                      <input name="name" required placeholder="Abdul Rehman" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#121520', border: '1px solid var(--border)', color: '#fff', font: '600 13px Space Grotesk' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, letterSpacing: 1 }}>PHONE NUMBER</label>
                      <input name="phone" required placeholder="0318 3707098" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#121520', border: '1px solid var(--border)', color: '#fff', font: '600 13px Space Grotesk' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, letterSpacing: 1 }}>DELIVERY ADDRESS</label>
                    <input name="address" required placeholder="House/Flat #, Street, Area" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#121520', border: '1px solid var(--border)', color: '#fff', font: '600 13px Space Grotesk' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, letterSpacing: 1 }}>CITY</label>
                    <input name="city" required defaultValue="Karachi" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#121520', border: '1px solid var(--border)', color: '#fff', font: '600 13px Space Grotesk' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, letterSpacing: 1 }}>PAYMENT METHOD</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13, color: '#fff' }}>
                        <input type="radio" name="paymentMethod" value="EasyPaisa (03183707098)" defaultChecked />
                        <span>📱 EasyPaisa</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13, color: '#fff' }}>
                        <input type="radio" name="paymentMethod" value="Cash on Delivery" />
                        <span>💵 Cash on Delivery</span>
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '15px', fontSize: 15, marginTop: 10, borderRadius: 12 }}>
                    Confirm & Place Order (PKR {grandTotal.toLocaleString()}) →
                  </button>
                </form>
              </div>
            )}
          </div>
        </>
      )}

      {/* TOAST WRAPPER */}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <span>⚡</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </Router>
  );
}

/* ═══════════════════════════════════════════
   NAVBAR COMPONENT
═══════════════════════════════════════════ */
function Navbar({ cartCount, wishlistCount, onOpenCart, onOpenWishlist, searchQuery, setSearchQuery }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="nav-brand">
        <div className="nav-logo-box">&lt;/&gt;</div>
        <span style={{ color: '#fff' }}>Tech<strong style={{ color: 'var(--red)' }}>Store</strong></span>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
        <Link to="/shop" className={`nav-item ${location.pathname === '/shop' ? 'active' : ''}`}>Shop</Link>
        <Link to="/about" className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
        <Link to="/contact" className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Wishlist Button */}
        <button
          onClick={() => { playAudioFx('click'); onOpenWishlist(); }}
          className="btn btn-ghost"
          style={{ padding: '8px 14px', borderRadius: 20, fontSize: 13, gap: 6 }}
          title="Wishlist"
        >
          <span>❤️</span>
          <span className="nav-text" style={{ fontWeight: 700 }}>{wishlistCount}</span>
        </button>

        {/* Cart Button */}
        <button
          onClick={() => { playAudioFx('click'); onOpenCart(); }}
          className="btn btn-primary"
          style={{ padding: '8px 18px', borderRadius: 20, fontSize: 13, gap: 8 }}
        >
          <span>🛒</span>
          <span className="nav-text">Bag</span>
          <span style={{ background: '#fff', color: '#000', padding: '1px 7px', borderRadius: 12, fontSize: 11, fontWeight: 800 }}>
            {cartCount}
          </span>
        </button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   HOME PAGE COMPONENT
═══════════════════════════════════════════ */
function HomePage({ products, onAddToCart, onQuickView, wishlist, onToggleWishlist }) {
  return (
    <div>
      {/* HERO SECTION */}
      <section style={{ padding: '100px 5% 70px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 550, height: 550, background: 'var(--red)', filter: 'blur(160px)', opacity: 0.12, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', left: '-5%', width: 400, height: 400, background: 'var(--cyan)', filter: 'blur(150px)', opacity: 0.08, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 30, background: 'rgba(255,42,75,0.08)', border: '1px solid rgba(255,42,75,0.3)', color: '#ff6b81', font: '700 11px Space Grotesk', letterSpacing: 2, marginBottom: 20 }}>
            <span>⚡</span> HIGH-OCTANE DEVELOPER & CREATOR HARDWARE
          </div>
          <h1 className="hero-title" style={{ font: '800 clamp(38px, 6vw, 68px)/1.08 Space Grotesk', color: '#fff', marginBottom: 22, letterSpacing: -1 }}>
            Engineered for <span style={{ color: 'var(--red)', textShadow: '0 0 40px var(--red-glow)' }}>Power.</span><br />
            Crafted for <em style={{ fontStyle: 'normal', color: 'var(--cyan)' }}>Precision.</em>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.7, marginBottom: 34, maxWidth: 640, margin: '0 auto 34px' }}>
            Next-generation mechanical keyboards, studio-grade audio, 4K curved displays, and ergonomic workstation essentials built for software engineers and creators.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-primary" style={{ padding: '15px 32px', fontSize: 15, borderRadius: 14 }}>
              Explore Complete Store →
            </Link>
            <Link to="/about" className="btn btn-ghost" style={{ padding: '15px 28px', fontSize: 15, borderRadius: 14 }}>
              Atelier Engineering
            </Link>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20, marginTop: 60, padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <div>
              <div style={{ font: '800 30px Space Grotesk', color: '#fff' }}>12<span style={{ color: 'var(--red)' }}>+</span></div>
              <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1, marginTop: 4 }}>FLAGSHIP GEAR</div>
            </div>
            <div>
              <div style={{ font: '800 30px Space Grotesk', color: '#fff' }}>2,400<span style={{ color: 'var(--red)' }}>+</span></div>
              <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1, marginTop: 4 }}>HAPPY CLIENTS</div>
            </div>
            <div>
              <div style={{ font: '800 30px Space Grotesk', color: '#fff' }}>4.9<span style={{ color: 'var(--gold)' }}>★</span></div>
              <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1, marginTop: 4 }}>TOP RATINGS</div>
            </div>
            <div>
              <div style={{ font: '800 30px Space Grotesk', color: '#fff' }}>24<span style={{ color: 'var(--red)' }}>h</span></div>
              <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1, marginTop: 4 }}>FAST DISPATCH</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BESTSELLERS */}
      <section style={{ padding: '40px 5% 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ font: '700 11px Space Grotesk', letterSpacing: 2, color: 'var(--red)', marginBottom: 6 }}>CURATED SPOTLIGHT</div>
            <h2 style={{ font: '800 32px Space Grotesk', color: '#fff' }}>Featured Best Sellers</h2>
          </div>
          <Link to="/shop" style={{ color: 'var(--red)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            View Full Store <span>→</span>
          </Link>
        </div>

        <div className="product-grid">
          {products.slice(0, 6).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              isWishlisted={wishlist.some(w => w.id === product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </section>

      {/* VALUE PILLARS */}
      <section style={{ padding: '80px 5%', background: '#0a0c12', borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 48px' }}>
          <div style={{ font: '700 11px Space Grotesk', letterSpacing: 2, color: 'var(--red)', marginBottom: 6 }}>WHY TECHSTORE</div>
          <h2 style={{ font: '800 32px Space Grotesk', color: '#fff' }}>Engineered Without Compromise</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {[
            { icon: '🚀', title: 'Lightning Nationwide Shipping', desc: 'Orders packed within 2 hours. Free delivery across Pakistan on orders over PKR 10,000.' },
            { icon: '🛡️', title: '1-Year Full Warranty', desc: 'Every device undergoes a 28-point electrical test before dispatch with zero-hassle replacement.' },
            { icon: '💳', title: 'EasyPaisa & Cash on Delivery', desc: 'Secure direct payments via EasyPaisa (03183707098) or pay in cash right at your doorstep.' },
            { icon: '💬', title: 'Developer-Led Concierge', desc: 'Real hardware engineers ready to help you assemble and configure your ideal workspace setup.' }
          ].map((pillar, idx) => (
            <div key={idx} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 18, padding: '32px 26px' }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{pillar.icon}</div>
              <h3 style={{ font: '700 18px Space Grotesk', color: '#fff', marginBottom: 8 }}>{pillar.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7 }}>{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRODUCT CARD COMPONENT
═══════════════════════════════════════════ */
function ProductCard({ product, onAddToCart, onQuickView, isWishlisted, onToggleWishlist }) {
  return (
    <article className="prod-card">
      <div className="prod-tag-badge">{product.tag}</div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        {isWishlisted ? '❤️' : '♡'}
      </button>

      <div className="prod-img-box" onClick={() => onQuickView(product)} style={{ cursor: 'pointer' }}>
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: 1.5 }}>
            {product.category.toUpperCase()}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>
            <span>★</span>
            <span style={{ color: '#fff' }}>{product.rating}</span>
          </div>
        </div>

        <h3
          onClick={() => onQuickView(product)}
          style={{ font: '700 17px Space Grotesk', color: '#fff', marginBottom: 8, lineHeight: 1.3, cursor: 'pointer' }}
        >
          {product.name}
        </h3>

        <p style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
          {product.desc.substring(0, 85)}...
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <div>
            <div style={{ font: '800 19px Space Grotesk', color: 'var(--red)' }}>
              PKR {product.price.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'line-through' }}>
              PKR {product.originalPrice.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="btn btn-primary"
            style={{ padding: '9px 18px', borderRadius: 10, fontSize: 12 }}
          >
            Add +
          </button>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════
   SHOP PAGE COMPONENT
═══════════════════════════════════════════ */
function ShopPage({ products, onAddToCart, onQuickView, wishlist, onToggleWishlist, searchQuery, setSearchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return a.id - b.id;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div style={{ padding: '40px 5% 80px' }}>
      {/* Header */}
      <div style={{ maxWidth: 700, marginBottom: 36 }}>
        <div style={{ font: '700 11px Space Grotesk', letterSpacing: 2, color: 'var(--red)', marginBottom: 6 }}>PRODUCT CATALOG</div>
        <h1 style={{ font: '800 36px Space Grotesk', color: '#fff', marginBottom: 10 }}>All Tech Products</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Browse our full portfolio of high-grade developer workstations, gear, and accessories.</p>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: 16, border: '1px solid var(--border)' }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { playAudioFx('click'); setSelectedCategory(cat); }}
              style={{
                padding: '7px 16px', borderRadius: 20,
                background: selectedCategory === cat ? 'var(--red)' : 'rgba(255,255,255,0.04)',
                color: selectedCategory === cat ? '#fff' : 'var(--muted)',
                border: '1px solid ' + (selectedCategory === cat ? 'var(--red)' : 'var(--border)'),
                font: '700 11.5px Space Grotesk', cursor: 'pointer', transition: 'all .2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: 10, background: '#121520', border: '1px solid var(--border)', color: '#fff', font: '600 12px Space Grotesk', minWidth: 200 }}
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 10, background: '#121520', border: '1px solid var(--border)', color: '#fff', font: '600 12px Space Grotesk', cursor: 'pointer' }}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
        Showing <strong style={{ color: '#fff' }}>{filteredProducts.length}</strong> products
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
          <h3 style={{ font: '700 20px Space Grotesk', color: '#fff', marginBottom: 8 }}>No products match your criteria</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>Try resetting your category filter or search keywords.</p>
          <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="btn btn-primary">Reset Filters</button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              isWishlisted={wishlist.some(w => w.id === product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRODUCT DETAIL PAGE COMPONENT
═══════════════════════════════════════════ */
function ProductDetailPage({ products, onAddToCart, wishlist, onToggleWishlist }) {
  const location = useLocation();
  const id = parseInt(location.pathname.split('/').pop());
  const product = products.find(p => p.id === id) || products[0];
  const [qty, setQty] = useState(1);
  const isWishlisted = wishlist.some(w => w.id === product.id);

  return (
    <div style={{ padding: '40px 5% 80px', maxWidth: 1100, margin: '0 auto' }}>
      <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 13, fontWeight: 700, marginBottom: 30 }}>
        ← Back to Shop
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>
        <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '1/1', background: '#0a0c12', border: '1px solid var(--border)' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div>
          <div style={{ display: 'inline-block', background: 'rgba(255,42,75,0.1)', color: 'var(--red)', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, marginBottom: 12 }}>
            {product.tag}
          </div>
          <h1 style={{ font: '800 clamp(28px, 4vw, 40px) Space Grotesk', color: '#fff', marginBottom: 12, lineHeight: 1.15 }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--gold)', marginBottom: 20 }}>
            <span>★★★★★</span>
            <span style={{ color: '#fff', fontWeight: 800 }}>{product.rating}</span>
            <span style={{ color: 'var(--muted)' }}>({product.reviews} verified reviews)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20 }}>
            <span style={{ font: '800 36px Space Grotesk', color: 'var(--red)' }}>
              PKR {product.price.toLocaleString()}
            </span>
            <span style={{ fontSize: 18, color: 'var(--muted)', textDecoration: 'line-through' }}>
              PKR {product.originalPrice.toLocaleString()}
            </span>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
            {product.desc}
          </p>

          {/* Specs list */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ font: '700 12px Space Grotesk', color: '#fff', letterSpacing: 1, marginBottom: 10 }}>HARDWARE SPECIFICATIONS:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {product.specs.map((spec, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: 8, fontSize: 12, color: '#c3c7d6', border: '1px solid var(--border)' }}>
                  ✓ {spec}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#121520', padding: '10px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer' }}>−</button>
              <span style={{ fontWeight: 800, fontSize: 15, minWidth: 20, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer' }}>+</button>
            </div>
            <button
              onClick={() => onAddToCart(product, qty)}
              className="btn btn-primary"
              style={{ flex: 1, padding: '16px', borderRadius: 12, fontSize: 15 }}
            >
              Add {qty} to Bag 🛒
            </button>
            <button
              onClick={() => onToggleWishlist(product)}
              className="btn btn-ghost"
              style={{ padding: '16px 20px', borderRadius: 12 }}
            >
              {isWishlisted ? '❤️' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ABOUT PAGE COMPONENT
═══════════════════════════════════════════ */
function AboutPage() {
  return (
    <div style={{ padding: '60px 5% 100px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ font: '700 11px Space Grotesk', letterSpacing: 2, color: 'var(--red)', marginBottom: 8, textAlign: 'center' }}>OUR PHILOSOPHY</div>
      <h1 style={{ font: '800 clamp(32px, 5vw, 52px) Space Grotesk', color: '#fff', textAlign: 'center', marginBottom: 24, lineHeight: 1.1 }}>
        Built for Developers.<br /><span style={{ color: 'var(--red)' }}>Obsessed with Quality.</span>
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.9, textAlign: 'center', marginBottom: 60 }}>
        TechStore was founded in Karachi by Abdul Rehman to bridge the gap between premium global computing hardware and software developers across Pakistan. Every keyboard, display, audio monitor, and peripheral is meticulously curated for reliability and high productivity.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 60 }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 18, padding: 28 }}>
          <div style={{ font: '800 32px Space Grotesk', color: 'var(--red)', marginBottom: 6 }}>100%</div>
          <h3 style={{ font: '700 16px Space Grotesk', color: '#fff', marginBottom: 6 }}>Authentic Products</h3>
          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>Direct imports from premier global electronics manufacturers with official certificates.</p>
        </div>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 18, padding: 28 }}>
          <div style={{ font: '800 32px Space Grotesk', color: 'var(--cyan)', marginBottom: 6 }}>1ms</div>
          <h3 style={{ font: '700 16px Space Grotesk', color: '#fff', marginBottom: 6 }}>Zero-Lag Performance</h3>
          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>Tailored for software architects, competitive gamers, and creative professionals.</p>
        </div>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 18, padding: 28 }}>
          <div style={{ font: '800 32px Space Grotesk', color: 'var(--gold)', marginBottom: 6 }}>24/7</div>
          <h3 style={{ font: '700 16px Space Grotesk', color: '#fff', marginBottom: 6 }}>Concierge Support</h3>
          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>Instant resolution via WhatsApp and phone support for all Pakistani clients.</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CONTACT PAGE COMPONENT
═══════════════════════════════════════════ */
function ContactPage({ showToast }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ padding: '60px 5% 100px', maxWidth: 840, margin: '0 auto' }}>
      <div style={{ font: '700 11px Space Grotesk', letterSpacing: 2, color: 'var(--red)', marginBottom: 8, textAlign: 'center' }}>SUPPORT DESK</div>
      <h1 style={{ font: '800 clamp(32px, 5vw, 48px) Space Grotesk', color: '#fff', textAlign: 'center', marginBottom: 14 }}>
        Get in Touch
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 15, textAlign: 'center', marginBottom: 40 }}>
        Have questions about product compatibility, bulk orders, or custom workspace builds?
      </p>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 24, padding: '36px 32px' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
            <h3 style={{ font: '800 24px Space Grotesk', color: '#fff', marginBottom: 8 }}>Message Sent Successfully!</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Our team will respond to your inquiry within 2 business hours.</p>
          </div>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              playAudioFx('success');
              setSubmitted(true);
              showToast('✅ Message dispatched to TechStore Support');
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>YOUR NAME</label>
                <input required placeholder="Abdul Rehman" style={{ width: '100%', padding: '12px 16px', borderRadius: 10, background: '#121520', border: '1px solid var(--border)', color: '#fff', font: '600 13px Space Grotesk' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>EMAIL ADDRESS</label>
                <input type="email" required placeholder="abdul@example.com" style={{ width: '100%', padding: '12px 16px', borderRadius: 10, background: '#121520', border: '1px solid var(--border)', color: '#fff', font: '600 13px Space Grotesk' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>SUBJECT</label>
              <input required placeholder="Custom Workspace Build Inquiry" style={{ width: '100%', padding: '12px 16px', borderRadius: 10, background: '#121520', border: '1px solid var(--border)', color: '#fff', font: '600 13px Space Grotesk' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>MESSAGE</label>
              <textarea rows={4} required placeholder="Describe your setup requirements..." style={{ width: '100%', padding: '12px 16px', borderRadius: 10, background: '#121520', border: '1px solid var(--border)', color: '#fff', font: '600 13px Space Grotesk' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '14px', borderRadius: 12, fontSize: 14 }}>
              Send Message →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FOOTER COMPONENT
═══════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '50px 5% 30px', background: '#050608' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, font: '800 20px Space Grotesk' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>&lt;/&gt;</div>
          <span>Tech<strong style={{ color: 'var(--red)' }}>Store</strong></span>
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--muted)' }}>
          <Link to="/" style={{ color: 'var(--muted)' }}>Home</Link>
          <Link to="/shop" style={{ color: 'var(--muted)' }}>Shop</Link>
          <Link to="/about" style={{ color: 'var(--muted)' }}>About</Link>
          <Link to="/contact" style={{ color: 'var(--muted)' }}>Contact</Link>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#686c7d' }}>
        <div>© 2026 TechStore — Engineered by <strong>Abdul Rehman</strong> | Karachi, Pakistan</div>
        <div>Built with React 18 · Vite · Web Audio API · HashRouter</div>
      </div>
    </footer>
  );
}
