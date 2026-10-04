import React, { useState } from 'react';
import {
  ShoppingCart, LogIn, UserPlus, AlertCircle, CheckCircle2, ShieldCheck,
  Smartphone, Laptop, Gamepad2, Eye, EyeOff, FileCheck2, BadgeCheck, Sparkles, Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { looksLikeEmail, looksLikePhone } from '../utils/products';
import Logo from './Logo';
import IntroGadgetSplash from './IntroGadgetSplash';
import GadgetMorpher from './GadgetMorpher';

export default function LandingAuthPage({ onAuthSuccess }) {
  const { login, signup } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [tab, setTab] = useState('login');

  const [username, setUsername] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const switchTab = (next) => {
    setTab(next);
    setError('');
    setNotFound(false);
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setNotFound(false); setSuccess(''); setBusy(true);
    try {
      const res = await login(identifier, password);
      if (res.success) {
        setSuccess("Signed in successfully!");
        onAuthSuccess();
      } else if (res.code === 'ACCOUNT_NOT_FOUND') {
        setNotFound(true);
        setError("No account found for these details. Please sign up first with your mobile number or account.");
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch {
      setError("Can't reach the JAI's Cart server. Please make sure the backend is running.");
    } finally {
      setBusy(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setNotFound(false); setSuccess('');

    if (!looksLikePhone(identifier) && !looksLikeEmail(identifier)) {
      setError('Enter a valid mobile number (10–15 digits) or email address.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setBusy(true);
    try {
      const res = await signup(username, identifier, password);
      if (res.success) {
        setSuccess('Account created and saved. Signing you in…');
        onAuthSuccess();
      } else {
        setError(res.message || 'Sign up failed.');
      }
    } catch {
      setError("Can't reach the JAI's Cart server. Please make sure the backend is running.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <GadgetMorpher />
      {showIntro && <IntroGadgetSplash onComplete={() => setShowIntro(false)} />}
      <div className="auth-shell">

        {/* LEFT — login / sign up */}
        <section className="auth-form-side" aria-label="Sign in or sign up">
          <div className="auth-form-inner fade-in">
            <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: 12 }}>
              <Logo size="md" />
              <button
                type="button"
                className="btn btn-soft btn-sm"
                onClick={() => setShowIntro(true)}
                title="Replay intro animation"
                style={{ marginLeft: 'auto', fontSize: 11.5, padding: '4px 10px' }}
              >
                <Play size={12} /> Replay Intro
              </button>
            </div>

            <h2 className="auth-heading">{tab === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p className="auth-sub">
              {tab === 'login'
                ? 'Sign in with your registered username, mobile number or email.'
                : 'Sign up once with your mobile number or email. Next time, just sign in.'}
            </p>

            <div className="tabs" role="tablist">
              <button type="button" role="tab" aria-selected={tab === 'login'} className={`tab ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
                <LogIn size={16} /> Sign In
              </button>
              <button type="button" role="tab" aria-selected={tab === 'signup'} className={`tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>
                <UserPlus size={16} /> Sign Up
              </button>
            </div>

            {error && (
              <div className="alert alert-error" role="alert">
                <AlertCircle size={18} />
                <div>
                  {error}
                  {notFound && (
                    <button type="button" className="alert-link" onClick={() => switchTab('signup')}>
                      Create an account now →
                    </button>
                  )}
                </div>
              </div>
            )}
            {success && (
              <div className="alert alert-ok" role="status">
                <CheckCircle2 size={18} /> <div>{success}</div>
              </div>
            )}

            <form className="auth-form" onSubmit={tab === 'login' ? handleLogin : handleSignup} noValidate>
              {tab === 'signup' && (
                <div className="field">
                  <label htmlFor="username">Full name / Username</label>
                  <input id="username" type="text" placeholder="e.g. Rahul Sharma" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="name" />
                </div>
              )}

              <div className="field">
                <label htmlFor="identifier">{tab === 'login' ? 'Username, mobile number or email' : 'Mobile number or email'}</label>
                <input id="identifier" type="text" placeholder={tab === 'login' ? 'Enter your username / phone / email' : '+91 98765 43210 or you@mail.com'} value={identifier} onChange={(e) => setIdentifier(e.target.value)} required autoComplete="username" />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <input id="password" type={showPw ? 'text' : 'password'} placeholder={tab === 'login' ? 'Your password' : 'At least 4 characters'} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={tab === 'login' ? 'current-password' : 'new-password'} />
                  <button type="button" className="toggle-eye" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
                {tab === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
                {busy ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="secure-note">
              <ShieldCheck size={15} color="var(--brand)" />
              Passwords are encrypted before they are stored.
            </p>
          </div>
        </section>

        {/* RIGHT — brand + moving cart */}
        <aside className="auth-brand-side" aria-label="About JAI's Cart">
          <div>
            <span className="badge"><Sparkles size={13} /> Pre-owned electronics marketplace</span>
            <div style={{ margin: '20px 0 16px' }}>
              <Logo size="lg" showTagline={true} />
            </div>
            <p className="brand-tag">
              Buy and sell <strong>Pre-owned and refurbished electronics</strong> with
              live working details and honest defect reports.
            </p>
          </div>

          <div className="cart-stage" aria-hidden="true">
            <div className="cart-road" />
            <div className="cart-runner">
              <div className="cart-body">
                <span className="cart-drop d1"><Smartphone size={16} /></span>
                <span className="cart-drop d2"><Laptop size={16} /></span>
                <span className="cart-drop d3"><Gamepad2 size={16} /></span>
                <ShoppingCart className="cart-icon" size={44} strokeWidth={2.4} />
              </div>
            </div>
          </div>

          <div className="brand-points">
            <div className="brand-point"><FileCheck2 size={16} /> Live working details</div>
            <div className="brand-point"><ShieldCheck size={16} /> Honest defect reports</div>
            <div className="brand-point"><BadgeCheck size={16} /> Registered sellers</div>
          </div>
        </aside>

      </div>
    </main>
  );
}
