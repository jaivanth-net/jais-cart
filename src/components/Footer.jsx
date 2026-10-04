import React from 'react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Logo size="sm" />
        <span>© 2026 JAI's Cart. Pre-owned &amp; refurbished electronics only.</span>
        <div className="footer-links">
          <span>Buyer Terms</span>
          <span>Seller Terms</span>
          <span>Privacy</span>
        </div>
      </div>
    </footer>
  );
}
