import React from 'react';
import { Cpu, Zap } from 'lucide-react';

export default function Logo({ size = 'md', showTagline = false }) {
  const isLarge = size === 'lg';
  
  return (
    <div className={`tech-logo-wrap ${size}`}>
      <div className="tech-logo-icon">
        <span className="chip-glow" />
        <Cpu size={isLarge ? 28 : 20} className="chip-icon" />
        <Zap size={isLarge ? 14 : 10} className="bolt-icon" />
      </div>
      <div className="tech-logo-text">
        <span className="brand-name">
          JAI&apos;S <span className="brand-cart">CART</span>
        </span>
        {showTagline && (
          <span className="tech-tagline">
            <span className="dot-live" /> ELECTRONICS &amp; GADGETS HUB
          </span>
        )}
      </div>
    </div>
  );
}
