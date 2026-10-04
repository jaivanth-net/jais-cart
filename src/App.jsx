import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingAuthPage from './components/LandingAuthPage';
import IntentChoicePage from './components/IntentChoicePage';
import Navbar from './components/Navbar';
import BuyElectronicsView from './components/BuyElectronicsView';
import SellElectronicsForm from './components/SellElectronicsForm';
import ProductDetailModal from './components/ProductDetailModal';
import Footer from './components/Footer';
import { api } from './services/api';
import { INITIAL_PRODUCTS } from './data/mockItems';
import { normalizeProduct } from './utils/products';

function JaisCartApp() {
  const { user, loading, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [intent, setIntent] = useState(null); // null -> ask, 'buy' | 'sell'
  const [selected, setSelected] = useState(null);

  // Always ask "buy or sell?" after a fresh login, and reset on logout.
  useEffect(() => {
    if (!user) setIntent(null);
  }, [user]);

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await api.getProducts();
      setProducts((res.success ? res.products : INITIAL_PRODUCTS).map(normalizeProduct));
    } catch {
      setProducts(INITIAL_PRODUCTS.map(normalizeProduct));
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadProducts();
  }, [user]);

  // Restoring a saved session
  if (loading) {
    return (
      <div className="intent-page" aria-busy="true">
        <Loader2 size={34} className="spin" color="var(--brand)" />
      </div>
    );
  }

  // 1) Front page = login / sign up
  if (!user) {
    return <LandingAuthPage onAuthSuccess={() => setIntent(null)} />;
  }

  // 2) Ask whether the user came to buy or sell
  if (!intent) {
    return <IntentChoicePage user={user} onSelect={setIntent} onLogout={logout} />;
  }

  // 3) Buy / Sell experience
  return (
    <div className="app">
      <Navbar
        user={user}
        intent={intent}
        setIntent={setIntent}
        onLogout={logout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="page">
        {intent === 'buy' ? (
          <BuyElectronicsView
            products={products}
            loading={productsLoading}
            onSelectProduct={setSelected}
            onGoSell={() => setIntent('sell')}
          />
        ) : (
          <SellElectronicsForm
            onCreated={(p) => {
              setProducts((prev) => [normalizeProduct(p), ...prev]);
              setIntent('buy');
            }}
            onCancel={() => setIntent('buy')}
          />
        )}
      </main>

      <Footer />

      {selected && <ProductDetailModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <JaisCartApp />
    </AuthProvider>
  );
}
