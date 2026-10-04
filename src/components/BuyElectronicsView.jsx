import React, { useMemo, useState } from 'react';
import {
  CheckCircle2, AlertTriangle, PhoneCall, ShieldCheck, MapPin, FileSearch, Search,
  FileText, ChevronDown, ChevronUp, PackageOpen, Tag
} from 'lucide-react';
import { CATEGORIES, formatINR } from '../utils/products';

export default function BuyElectronicsView({ products, loading, onSelectProduct, onGoSell }) {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [termsOpen, setTermsOpen] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return [p.title, p.brand, p.workingCondition, p.problems, p.city]
        .some((v) => String(v || '').toLowerCase().includes(q));
    });
    if (sort === 'low') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, query, sort]);

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <span className="badge">Buyer</span>
          <h1 style={{ marginTop: 12 }}>Pre-owned &amp; refurbished electronics</h1>
          <p>Every listing is posted by a registered user and shows exactly how the device works and what is wrong with it.</p>
        </div>
      </div>

      {/* Buyer terms */}
      <section className="terms-panel" aria-label="Buyer terms and conditions">
        <button type="button" className="terms-head" onClick={() => setTermsOpen(!termsOpen)} aria-expanded={termsOpen}>
          <span className="row">
            <span className="terms-icon"><FileText size={20} /></span>
            <span>
              <h3>Buyer terms &amp; conditions</h3>
              <p>Please read before contacting any seller.</p>
            </span>
          </span>
          {termsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {termsOpen && (
          <div className="terms-body">
            <div className="terms-item">
              <b>1. Information only</b>
              <p>JAI's Cart shows details supplied by sellers. We do not handle payment or delivery — you deal directly with the seller.</p>
            </div>
            <div className="terms-item">
              <b>2. Inspect before you pay</b>
              <p>Meet the seller, check the device and verify its working condition and listed problems before making any payment.</p>
            </div>
            <div className="terms-item">
              <b>3. Report wrong listings</b>
              <p>Sellers must describe problems honestly. Misleading listings may be removed and the seller account blocked.</p>
            </div>
          </div>
        )}
      </section>

      {/* Search + sort */}
      <div className="toolbar">
        <label className="search">
          <Search size={18} />
          <input type="search" placeholder="Search by model, brand, city or condition…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search electronics" />
        </label>
        <select className="sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort listings">
          <option value="newest">Newest first</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>

      <div className="chips" role="tablist" aria-label="Categories">
        {['all', ...CATEGORIES].map((c) => (
          <button key={c} type="button" className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
            {c === 'all' ? 'All electronics' : c}
          </button>
        ))}
      </div>

      {!loading && (
        <p className="result-count"><b>{filtered.length}</b> {filtered.length === 1 ? 'item' : 'items'} available</p>
      )}

      {loading ? (
        <div className="grid-products">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <PackageOpen size={44} color="var(--muted)" />
          <h3>No electronics found</h3>
          <p className="muted">Try another search or category — or be the first to list one.</p>
          <button type="button" className="btn btn-amber" onClick={onGoSell}><Tag size={16} /> Sell electronics</button>
        </div>
      ) : (
        <div className="grid-products">
          {filtered.map((item) => (
            <article key={item._id} className="pcard">
              <div className="pcard-media" onClick={() => onSelectProduct(item)}>
                <img src={item.imageUrl} alt={item.title} loading="lazy" />
                <span className="pill pill-grade">{item.grade}</span>
                <span className="pill pill-health"><ShieldCheck size={13} /> Health {item.healthScore}/100</span>
              </div>

              <div className="pcard-body">
                <div className="pcard-meta">
                  <span className="cat">{item.category} · {item.brand}</span>
                  <span><MapPin size={12} /> {item.city}</span>
                </div>

                <h3 className="clamp-2" onClick={() => onSelectProduct(item)}>{item.title}</h3>

                <div className="note note-ok">
                  <b><CheckCircle2 size={14} /> Live working condition</b>
                  <span className="clamp-2">{item.workingCondition}</span>
                </div>
                <div className="note note-warn">
                  <b><AlertTriangle size={14} /> Problems / defects</b>
                  <span className="clamp-2">{item.problems}</span>
                </div>

                <div className="seller-line">
                  <span>Seller: <strong>{item.sellerName}</strong></span>
                </div>

                <div className="pcard-foot">
                  <div className="price-row">
                    <span className="price">{formatINR(item.price)}</span>
                    {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                      <>
                        <span className="price-old">{formatINR(item.originalPrice)}</span>
                        <span className="badge-savings">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  <div className="card-actions">
                    <button type="button" className="btn btn-soft btn-sm" onClick={() => onSelectProduct(item)}>
                      <FileSearch size={15} /> Full details
                    </button>
                    {item.sellerPhone ? (
                      <a className="btn btn-primary btn-sm" href={`tel:${item.sellerPhone.replace(/\s/g, '')}`}>
                        <PhoneCall size={15} /> Call seller
                      </a>
                    ) : (
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => onSelectProduct(item)}>
                        <PhoneCall size={15} /> Contact
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
