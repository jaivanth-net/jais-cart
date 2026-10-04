export const FALLBACK_IMAGE = '/images/iphone14.png';

export const CATEGORIES = [
  'Mobiles',
  'Laptops',
  'Gaming',
  'Audio',
  'Cameras',
  'TV & Appliances',
  'Wearables'
];

export const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// Makes API items and bundled sample items look identical to the UI.
export function normalizeProduct(p) {
  const d = p.diagnostics || {};
  return {
    ...p,
    _id: p._id || p.id,
    imageUrl: p.imageUrl || (p.images && p.images[0]) || FALLBACK_IMAGE,
    workingCondition:
      p.workingCondition ||
      [d.batteryHealth, d.screenCondition, d.motherboardStatus].filter(Boolean).join('. ') ||
      'Fully working. Tested by seller.',
    problems: p.problems || d.bodyCondition || 'No problems reported by the seller.',
    sellerName: p.sellerName || 'Registered Seller',
    sellerPhone: p.sellerPhone || '',
    city: p.city || 'India',
    grade: p.grade || 'Pre-Owned',
    healthScore: p.healthScore || 90,
    originalPrice: p.originalPrice || Math.round(p.price * 1.5)
  };
}

export const phoneDigits = (s) => String(s || '').replace(/[^0-9]/g, '');
export const looksLikePhone = (s) => /^\+?[0-9\s-]{10,15}$/.test(String(s || '').trim());
export const looksLikeEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim());
