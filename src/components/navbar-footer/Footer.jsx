import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Facebook, Instagram } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Screening', to: '/screen' },
  { label: 'Pipeline', to: '/simulation' },
  { label: 'Reports', to: '/reports' },
  { label: 'Simulation', to: '/simulation' },
  { label: 'About', to: '/about' },
  { label: 'Privacy', to: '/about' },
  { label: 'Terms', to: '/about' },
];

const SOCIALS = [
  { icon: Twitter, label: 'Twitter / X', href: 'https://x.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
];

export default function Footer() {
  return (
    <footer className="footer-moony">
      <div className="container-wide" style={{ padding: '56px 24px 36px' }}>
        {/* Centered brand */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #7C5CFA 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 22px rgba(91, 61, 245, 0.4)',
              }}
            >
              <Eye size={18} color="#fff" strokeWidth={2.4} />
            </span> */}
            <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.02em' }}>
              Moody
            </span>
          </Link>
        </div>

        {/* Centered navigation */}
        <nav className="footer-moony__nav" aria-label="Footer">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Subtle divider */}
        <div className="footer-moony__divider" />

        {/* Bottom bar */}
        <div className="footer-moony__bottom">
          <span>
            © {new Date().getFullYear()} moody LLC. Built for demonstration purposes only.
          </span>
          <div className="footer-moony__social">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.label}
              >
                <social.icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <p className="footer-moony__legal">
          This application is a prototype demonstration and does not provide medical diagnosis.
        </p>
      </div>
    </footer>
  );
}
