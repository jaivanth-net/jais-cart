import React, { useEffect } from 'react';
import { X, ShieldCheck, MapPin, PhoneCall, CheckCircle2, AlertTriangle, MessageCircle, FileSearch, Calendar } from 'lucide-react';
import { formatINR, phoneDigits } from '../utils/products';

export default function ProductDetailModal({ product, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!product) return null;
  const digits = phoneDigits(product.sellerPhone);
  const posted = product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

  return (
    <div className="overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={product.title}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2><FileSearch size={20} /> Item information</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div>
              <div className="detail-media">
                <img src={product.imageUrl} alt={product.title} />
                <span className="pill pill-grade">{product.grade}</span>
                <span className="pill pill-health"><ShieldCheck size={13} /> Health {product.healthScore}/100</span>
              </div>
            </div>

            <div className="detail-info">
              <div>
                <div className="pcard-meta" style={{ marginBottom: 8 }}>
                  <span className="cat">{product.category} · {product.brand}</span>
                  <span><MapPin size={12} /> {product.city}</span>
                </div>
                <h1>{product.title}</h1>
                {posted && <p className="hint" style={{ marginTop: 6, display: 'flex', gap: 6, alignItems: 'center' }}><Calendar size={13} /> Listed on {posted}</p>}
              </div>

              <div className="price-box" style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span className="price" style={{ fontSize: 30, fontWeight: 800, color: 'var(--brand)' }}>
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                  <>
                    <span className="price-old" style={{ fontSize: 16, color: 'var(--muted)', textDecoration: 'line-through' }}>
                      MRP {formatINR(product.originalPrice)}
                    </span>
                    <span className="badge-savings" style={{ padding: '4px 10px', fontSize: 13 }}>
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% ({formatINR(product.originalPrice - product.price)} OFF)
                    </span>
                  </>
                )}
              </div>

              <div className="note note-ok" style={{ fontSize: 13.5 }}>
                <b><CheckCircle2 size={15} /> Live working condition</b>
                {product.workingCondition}
              </div>
              <div className="note note-warn" style={{ fontSize: 13.5 }}>
                <b><AlertTriangle size={15} /> Problems / defects</b>
                {product.problems}
              </div>

              <div className="seller-box">
                <span className="avatar">{product.sellerName.charAt(0).toUpperCase()}</span>
                <div>
                  <b>{product.sellerName}</b>
                  <span>{product.sellerPhone || 'Phone not provided'}</span>
                </div>
              </div>

              {product.sellerPhone && (
                <div className="detail-actions">
                  <a className="btn btn-primary" href={`tel:${product.sellerPhone.replace(/\s/g, '')}`}>
                    <PhoneCall size={17} /> Call seller
                  </a>
                  {digits && (
                    <a className="btn btn-soft" href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer">
                      <MessageCircle size={17} /> WhatsApp
                    </a>
                  )}
                </div>
              )}

              <p className="fineprint">
                <b>Buyer terms:</b> details are provided by the seller. Inspect the device in person and confirm its working condition and problems before you pay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
