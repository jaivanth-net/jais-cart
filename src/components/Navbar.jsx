import React from 'react';
import { ShoppingBag, Tag, LogOut, Sun, Moon } from 'lucide-react';
import Logo from './Logo';

export default function Navbar({ user, intent, setIntent, onLogout, darkMode, setDarkMode }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button type="button" className="logo-btn" onClick={() => setIntent('buy')} aria-label="JAI's Cart home">
          <Logo size="md" />
        </button>

        <nav className="segmented" aria-label="Buy or sell">
          <button type="button" className={intent === 'buy' ? 'on-buy' : ''} onClick={() => setIntent('buy')}>
            <ShoppingBag size={16} /> Buy
          </button>
          <button type="button" className={intent === 'sell' ? 'on-sell' : ''} onClick={() => setIntent('sell')}>
            <Tag size={16} /> Sell
          </button>
        </nav>

        <div className="topbar-actions">
          <div className="user-chip">
            <span className="avatar">{user.username.charAt(0).toUpperCase()}</span>
            <span className="user-meta">
              <b>{user.username}</b>
              <span>Signed in</span>
            </span>
          </div>
          <button type="button" className="icon-btn" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme" title="Toggle theme">
            {darkMode ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} />}
          </button>
          <button type="button" className="icon-btn" onClick={onLogout} aria-label="Sign out" title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
