import React, { useRef, useState } from 'react';
import { Tag, CheckCircle2, AlertTriangle, ScrollText, ShieldAlert, Loader2, Clipboard, ClipboardCheck, Link2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CATEGORIES, looksLikePhone } from '../utils/products';

// Shrinks the chosen photo so it uploads quickly and stays small in the database.
function compressImage(file, maxSide = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a valid image.'));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const SELLER_TERMS = [
  ['You own the device.', 'You are the legal owner and it is not stolen, blacklisted or locked to another person.'],
  ['Honest working details.', 'Everything you write about how the device works must be true and tested by you.'],
  ['Disclose every problem.', 'Scratches, dents, battery wear, missing accessories or faults must be listed clearly.'],
  ['Real photo.', 'The photo you upload must be of the actual device you are selling.'],
  ['Direct dealing.', 'Buyers will contact you on the phone number you give. JAI\'s Cart does not handle payment or delivery.'],
  ['Removal rights.', 'Misleading listings may be removed and the account blocked.']
];

export default function SellElectronicsForm({ onCreated, onCancel }) {
  const { user, token } = useAuth();
  const pasteInputRef = useRef(null);

  const [accepted, setAccepted] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mobiles');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [workingCondition, setWorkingCondition] = useState('');
  const [problems, setProblems] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sellerPhone, setSellerPhone] = useState(looksLikePhone(user?.phoneOrEmail) ? user.phoneOrEmail : '');
  const [city, setCity] = useState('');

  const [busy, setBusy] = useState(false);
  const [imgBusy, setImgBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handles pasting an image file (e.g. copied image/screenshot via Ctrl+V) or image URL text
  const handlePaste = async (e) => {
    setError('');
    const items = e.clipboardData?.items;
    
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            setImgBusy(true);
            try {
              const compressed = await compressImage(file);
              setImageUrl(compressed);
            } catch (err) {
              setError(err.message || 'Failed to process pasted image.');
            } finally {
              setImgBusy(false);
            }
            return;
          }
        }
      }
    }

    const pastedText = e.clipboardData?.getData('text');
    if (pastedText && (pastedText.startsWith('http://') || pastedText.startsWith('https://') || pastedText.startsWith('data:image/'))) {
      setImageUrl(pastedText.trim());
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!accepted) { setError("Please accept the Seller Terms & Conditions first."); return; }
    if (!imageUrl) { setError('Please paste a photo or image link of the device (Ctrl+V).'); return; }
    if (!looksLikePhone(sellerPhone)) { setError('Enter a valid contact phone number (10–15 digits).'); return; }
    if (Number(price) <= 0) { setError('Enter a valid selling price.'); return; }
    if (originalPrice && Number(originalPrice) < Number(price)) {
      setError('Original price should be higher than or equal to your selling price.');
      return;
    }

    setBusy(true);
    try {
      const res = await api.createProduct({
        title: title.trim(),
        category,
        brand: brand.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.4),
        workingCondition: workingCondition.trim(),
        problems: problems.trim(),
        imageUrl,
        sellerPhone: sellerPhone.trim(),
        city: city.trim() || 'India',
        grade: 'Pre-Owned'
      }, token);

      if (res.success) {
        setSuccess('Your item is live on JAI\'s Cart!');
        setTimeout(() => onCreated(res.product), 900);
      } else {
        setError(res.message || 'Could not publish the item.');
      }
    } catch {
      setError("Can't reach the JAI's Cart server. Please make sure the backend is running.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sell-wrap fade-in">
      <div className="page-head" style={{ marginBottom: 0 }}>
        <div>
          <span className="badge badge-amber">Seller</span>
          <h1 style={{ marginTop: 12 }}>Sell your electronics</h1>
          <p>Accept the seller terms, then tell buyers how your device works, what is wrong with it and what you want for it.</p>
        </div>
      </div>

      {/* Step 1 — terms */}
      <section className="card" aria-label="Seller terms and conditions">
        <div className="row">
          <span className="terms-icon" style={{ background: 'var(--amber-soft)', color: 'var(--amber)' }}><ScrollText size={20} /></span>
          <div>
            <h3 style={{ fontSize: 18 }}>Step 1 · Seller terms &amp; conditions</h3>
            <p className="hint">You must accept these before you can publish an item.</p>
          </div>
        </div>

        <ul className="terms-list">
          {SELLER_TERMS.map(([head, body]) => (
            <li key={head}><ShieldAlert size={16} /><span><b>{head}</b> {body}</span></li>
          ))}
        </ul>

        <label className="accept-row">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
          I have read and accept the Seller Terms &amp; Conditions
        </label>
      </section>

      {/* Step 2 — details */}
      <form className="card" onSubmit={submit} aria-label="Item details">
        <div className="row" style={{ marginBottom: 20 }}>
          <span className="terms-icon"><Tag size={20} /></span>
          <div>
            <h3 style={{ fontSize: 18 }}>Step 2 · Item details</h3>
            <p className="hint">{accepted ? 'Fill in the details below.' : 'Accept the terms above to unlock this form.'}</p>
          </div>
        </div>

        {error && <div className="alert alert-error" role="alert"><AlertTriangle size={18} /><div>{error}</div></div>}
        {success && <div className="alert alert-ok" role="status"><CheckCircle2 size={18} /><div>{success}</div></div>}

        <fieldset disabled={!accepted || busy}>
          <div className="form-grid">
            <div className="field field-full">
              <label htmlFor="title">Item name / model *</label>
              <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Apple iPhone 13 Pro 128GB (Sierra Blue)" required />
            </div>

            <div className="field">
              <label htmlFor="category">Category *</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="field">
              <label htmlFor="brand">Brand *</label>
              <input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Apple, Samsung, Sony, Dell…" required />
            </div>

            <div className="field">
              <label htmlFor="price">Selling price (₹) *</label>
              <input id="price" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 45000" required />
            </div>

            <div className="field">
              <label htmlFor="originalPrice">Original price / MRP (₹)</label>
              <input id="originalPrice" type="number" min="1" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="e.g. 85000 (when new)" />
            </div>

            <div className="field">
              <label htmlFor="city">City *</label>
              <input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" required />
            </div>

            <div className="field field-full">
              <label htmlFor="working"><CheckCircle2 size={15} color="var(--brand)" /> Live working condition *</label>
              <textarea id="working" value={workingCondition} onChange={(e) => setWorkingCondition(e.target.value)} placeholder="How well does it work today? e.g. Everything works. Battery health 91%, camera and speakers tested, no screen burn." required />
            </div>

            <div className="field field-full">
              <label htmlFor="problems"><AlertTriangle size={15} color="var(--amber)" /> Problems / defects *</label>
              <textarea id="problems" value={problems} onChange={(e) => setProblems(e.target.value)} placeholder="Be honest. e.g. Small scratch on back glass, charger not included. Write “None” if there are none." required />
            </div>

            <div className="field field-full">
              <label htmlFor="photoUrl">
                <ClipboardCheck size={16} color="var(--brand)" /> Copy &amp; Paste Photo of Device *
              </label>
              
              <div className="paste-zone" onPaste={handlePaste} tabIndex={0}>
                <div className="paste-preview-ph">
                  {imgBusy ? (
                    <Loader2 size={28} className="spin" />
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Pasted device preview"
                      onError={() => setError('Unable to load image preview. Please verify the URL or try pasting again.')}
                    />
                  ) : (
                    <Clipboard size={32} color="var(--brand)" />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <b style={{ fontSize: 14 }}>Copy &amp; Paste Photo Method</b>
                    <span className="badge badge-amber" style={{ fontSize: 11, padding: '1px 6px' }}>Ctrl + V</span>
                  </div>
                  <p className="hint" style={{ marginBottom: 10, fontSize: 12.5 }}>
                    Copy any image file or image link (Ctrl+C), then press <b>Ctrl+V</b> inside the box below.
                  </p>

                  <div className="paste-input-row">
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Link2 size={16} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--muted)' }} />
                      <input
                        ref={pasteInputRef}
                        id="photoUrl"
                        type="text"
                        style={{ paddingLeft: 36 }}
                        value={imageUrl}
                        onChange={(e) => {
                          setError('');
                          setImageUrl(e.target.value);
                        }}
                        onPaste={handlePaste}
                        placeholder="Click here and press Ctrl+V to paste image or image link…"
                        required
                      />
                    </div>
                    {imageUrl && (
                      <button
                        type="button"
                        className="btn btn-soft btn-sm"
                        onClick={() => setImageUrl('')}
                        title="Remove photo"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="field field-full">
              <label htmlFor="phone">Contact phone number *</label>
              <input id="phone" type="tel" value={sellerPhone} onChange={(e) => setSellerPhone(e.target.value)} placeholder="+91 98765 43210" required />
              <span className="hint">Shown to buyers so they can call you.</span>
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: 24 }}>
            <button type="button" className="btn btn-soft" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-amber btn-lg" disabled={busy || imgBusy}>
              <Tag size={17} /> {busy ? 'Publishing…' : 'Publish item'}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
