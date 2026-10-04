import React from 'react';
import { ShoppingBag, Tag, ChevronRight, LogOut } from 'lucide-react';
import Logo from './Logo';

export default function IntentChoicePage({ user, onSelect, onLogout }) {
  return (
    <main className="intent-page">
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Logo size="lg" showTagline={true} />
        <span className="badge" style={{ marginTop: 20 }}>Signed in as {user.username}</span>
        <h1 style={{ marginTop: 12 }}>
          What brings you to <span className="gradient-text">JAI's Cart</span> today?
        </h1>
        <p className="muted" style={{ marginTop: 8 }}>Choose one to continue. You can switch any time from the top bar.</p>
      </div>

      <div className="intent-grid fade-in">
        <button type="button" className="intent-card buy" onClick={() => onSelect('buy')}>
          <span className="intent-icon"><ShoppingBag size={28} /></span>
          <h2>I want to Buy</h2>
          <p>Browse Pre-owned and refurbished electronics posted by other users — with live working details, known problems and seller contact.</p>
          <span className="intent-cta">Browse electronics <ChevronRight size={18} /></span>
        </button>

        <button type="button" className="intent-card sell" onClick={() => onSelect('sell')}>
          <span className="intent-icon"><Tag size={28} /></span>
          <h2>I want to Sell</h2>
          <p>List your used device. Accept the seller terms, describe how it works, disclose problems, set a price and upload a photo.</p>
          <span className="intent-cta">Sell my electronics <ChevronRight size={18} /></span>
        </button>
      </div>

      <button type="button" className="btn btn-soft btn-sm" onClick={onLogout}>
        <LogOut size={15} /> Sign out
      </button>
    </main>
  );
}
