import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { createTopDockController } from '../../lib/topDockController';


const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/screen', label: 'Screen' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dockRef = useRef(null);
  const mobileRef = useRef(null);
  const navigate = useNavigate();

  // threeui AnimatedTopDock physics on the center pill nav.
  useEffect(() => {
    const nav = dockRef.current;
    if (!nav) return undefined;

    let controller = null;

    controller = createTopDockController(nav, () => ({
      axis: 'x',
      proximity: 96,
      spring: 0.19,
      damping: 0.7,
      widthGrowth: 9,
      heightGrowth: 5,
      drop: 2,
      lockTrack: true,
    }));

    return () => {
      try {
        if (controller && typeof controller === 'function') controller();
      } catch (e) {
        /* ignore teardown noise in React StrictMode / fast remounts */
      }
    };
  }, []);

  // Close the mobile drawer on outside click.
  useEffect(() => {
    if (!open) return undefined;
    const onMouseDown = (event) => {
      if (mobileRef.current && !mobileRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToScreen = useCallback(() => {
    setOpen(false);
    navigate('/screen');
  }, [navigate]);

  const brand = (
    <>
      {/* <span className="moody-dock__brand-mark">
        <Eye size={16} color="#fff" strokeWidth={2.4} />
      </span> */}
      Moody
    </>
  );

  return (
    <>
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(251,250,253,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        transition: 'all 0.25s ease',
      }}
    >
      <div
        className="container-wide"
        style={{ display: 'flex', alignItems: 'center', height: 76, gap: 16, justifyContent: "space-between" }}
      >
        {/* Left: moody brand */}
        <NavLink to="/" className="moody-dock__brand" style={{ padding: 0, height: 'auto', marginRight: 0 }}>
          <span style={{fontWeight: 800, fontSize: "1.5rem"}}>{brand}</span>
        </NavLink>

        {/* Spacer (desktop only) to keep the dock centered */}
        <div className="d-none d-lg-block" style={{ flex: 1 }} />

        {/* Center: floating pill dock (desktop) */}
        <div className="moody-dock-wrap d-none d-lg-flex">
          <nav ref={dockRef} className="moody-dock" aria-label="Primary" data-dock-state="idle" data-dock-max="0.00">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                data-dock-item="true"
                className={({ isActive }) => `moody-dock__pill${isActive ? ' active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Spacer (desktop only) */}
        <div className="d-none d-lg-block" style={{ flex: 1 }} />

        {/* Right: status + primary action */}
        <div className="d-none d-lg-flex" style={{ alignItems: 'center', gap: 14 }}>
          {/* <BackendStatus /> */}
          <button className="btn-pill btn-primary-pill" onClick={goToScreen}>
            Start Screening
          </button>
        </div>

        <button
          className="d-lg-none"
          onClick={() => setOpen((v) => !v)}
          style={{ background: 'none', border: 'none', padding: 4, marginLeft: 0,}}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {typeof window !== 'undefined' && open && (
        <div
          ref={mobileRef}
          className="d-lg-none"
          style={{
            background: 'var(--color-card)',
            borderTop: '1px solid var(--color-border)',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: 16,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
              })}
            >
              {link.label}
            </NavLink>
          ))}
          {/* <div style={{ marginTop: 8 }}>
            <BackendStatus />
          </div> */}
          <button
            className="btn-pill btn-primary-pill"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={goToScreen}
          >
            Start Screening
          </button>
        </div>
      )}
    </header>
    </>
  );
}
