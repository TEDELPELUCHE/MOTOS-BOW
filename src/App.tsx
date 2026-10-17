/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Download, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  RotateCcw, 
  Headphones, 
  Filter, 
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WorkshopModal } from './components/WorkshopModal';
import { OrdersModal } from './components/OrdersModal';
import { AdminDrawer } from './components/AdminDrawer';
import { APKHubModal } from './components/APKHubModal';
import { OfflineIndicator } from './components/OfflineIndicator';

import { usePWAInstall } from './hooks/usePWAInstall';
import { INITIAL_PRODUCTS } from './data/initialData';
import { Product, CartItem, Order } from './types';

const STORAGE_KEYS = {
  CART: 'motos_bow_cart',
  ORDERS: 'motos_bow_orders',
  PRODUCTS: 'motos_bow_products',
};

export default function App() {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // App URL for APK generation and QR code
  const appUrl = typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null'
    ? window.location.origin
    : 'https://ais-pre-yaygobu3avxlem3ec53rah-532446881204.us-east1.run.app';

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'catalog' | 'workshop' | 'orders' | 'admin'>('catalog');
  const [isAPKHubOpen, setIsAPKHubOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWorkshopOpen, setIsWorkshopOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCompatibility, setSelectedCompatibility] = useState<string>('all');

  // Checkout State
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutShipping, setCheckoutShipping] = useState<'standard' | 'express' | 'pickup'>('standard');

  // Persistence - Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Persistence - Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistence - Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Handle Checkout
  const handleProceedToCheckout = (discount: number, shipping: 'standard' | 'express' | 'pickup') => {
    setCheckoutDiscount(discount);
    setCheckoutShipping(shipping);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCreated = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
  };

  // Inventory modifications
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Compatibility filter
      if (selectedCompatibility !== 'all') {
        const matchesCompat = p.compatibility.some((c) =>
          c.toLowerCase().includes(selectedCompatibility.toLowerCase())
        );
        if (!matchesCompat && !p.compatibility.some((c) => c.toLowerCase().includes('universal'))) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchCompat = p.compatibility.some((c) => c.toLowerCase().includes(q));
        return matchName || matchBrand || matchDesc || matchSku || matchCompat;
      }

      return true;
    });
  }, [products, selectedCategory, selectedCompatibility, searchQuery]);

  // Categories list
  const categories = [
    { id: 'all', label: 'Todos los Repuestos' },
    { id: 'repuestos', label: 'Motor & Kit Arrastre' },
    { id: 'lubricantes', label: 'Aceites & Químicos' },
    { id: 'accesorios', label: 'Cascos & Equipo' },
    { id: 'frenos', label: 'Pastillas & Discos' },
    { id: 'electricos', label: 'Baterías & Luces LED' },
    { id: 'neumaticos', label: 'Llantas Deportivas' },
  ];

  // Popular motorcycle models for fast filtering
  const motorcycleModels = [
    { id: 'all', label: 'Todas las Motos' },
    { id: 'pulsar', label: 'Bajaj Pulsar NS200' },
    { id: 'yamaha', label: 'Yamaha FZ / R15 / MT' },
    { id: 'gixxer', label: 'Suzuki Gixxer 150/250' },
    { id: 'ktm', label: 'KTM Duke / RC' },
    { id: 'universal', label: 'Accesorios Universales' },
  ];

  const handleFastInstall = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        confetti({ particleCount: 80, spread: 60 });
      }
    } else {
      setIsAPKHubOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAPKHub={() => setIsAPKHubOpen(true)}
        onOpenWorkshop={() => setIsWorkshopOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isInstalled={isInstalled}
        activeTab={activeTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-24 md:pb-12 space-y-6">
        
        {/* HERO BANNER: APK PROMO & VALUE PROPOSITION */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-950/60 p-5 sm:p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black tracking-wider uppercase">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Motos Bow para Celulares Android</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Instala la App en tu Celular <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                  en Formato APK Nativo
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Accede a repuestos con descuento exclusivo, catálogo con soporte sin internet (offline), cotizaciones de taller en 1 clic y notificaciones de envío.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <button
                  onClick={handleFastInstall}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{isInstalled ? 'APK Ya Instalado' : 'Instalar APK Ahora'}</span>
                </button>

                <button
                  onClick={() => setIsAPKHubOpen(true)}
                  className="px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ver Centro y Opciones de APK</span>
                </button>
              </div>
            </div>

            {/* Visual APK Badge Card */}
            <div className="hidden lg:flex flex-col items-center p-5 rounded-2xl bg-slate-950/70 border border-slate-800 backdrop-blur-md shadow-2xl space-y-3 shrink-0 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
                <Wrench className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-100">Motos Bow App</h4>
                <p className="text-[10px] text-amber-400 font-mono">com.motosbow.app</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>WebAPK & PWA Compliant</span>
              </div>
            </div>

          </div>
        </div>

        {/* VALUE PROPOSITION BADGES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-200">Envíos a Todo el País</h4>
              <p className="text-[10px] text-slate-400">Gratis en compras &gt; $100.000</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-200">Repuestos 100% Originales</h4>
              <p className="text-[10px] text-slate-400">Garantía directa con factura</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-200">Taller Especializado</h4>
              <p className="text-[10px] text-slate-400">Instalación y mantenimiento</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-200">Asesoría Mecánica</h4>
              <p className="text-[10px] text-slate-400">WhatsApp directo de soporte</p>
            </div>
          </div>
        </div>

        {/* CATEGORY SELECTOR CAROUSEL */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Categorías de Repuestos</span>
            </h3>
            <span className="text-xs text-slate-500">{filteredProducts.length} repuestos listos</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* COMPATIBILITY FILTER */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-400 scrollbar-none">
          <span className="font-bold text-slate-300 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Filtrar por Moto:
          </span>
          {motorcycleModels.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedCompatibility(m.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors border ${
                selectedCompatibility === m.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900/70 text-slate-400 border-slate-800/80 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-800 mx-auto flex items-center justify-center text-slate-500 border border-slate-700">
              <Flame className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-200 text-base">No se encontraron productos</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Intenta cambiar los términos de búsqueda o selecciona "Todos los Repuestos" para explorar el catálogo completo.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedCompatibility('all');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onViewDetails={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-400 font-bold">
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>MOTOS BOW • REPUESTOS & ACCESORIOS PARA MOTOS</span>
        </div>
        <p>Desarrollado con motor APK nativo para Android y soporte offline PWA.</p>
        <p className="text-[11px] text-slate-600">© 2026 Motos Bow. Todos los derechos reservados.</p>
      </footer>

      {/* OFFLINE INDICATOR */}
      <OfflineIndicator />

      {/* MOBILE BOTTOM NAVIGATION */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'workshop') setIsWorkshopOpen(true);
          if (tab === 'orders') setIsOrdersOpen(true);
          if (tab === 'admin') setIsAdminOpen(true);
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAPKHub={() => setIsAPKHubOpen(true)}
        isInstalled={isInstalled}
      />

      {/* MODALS */}
      {/* 1. APK HUB (CENTERPIECE OF USER'S "hazla APK" REQUEST) */}
      <APKHubModal
        isOpen={isAPKHubOpen}
        onClose={() => setIsAPKHubOpen(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        onInstall={install}
        appUrl={appUrl}
      />

      {/* 2. PRODUCT DETAILS MODAL */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 3. CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 4. CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        discountPercent={checkoutDiscount}
        shippingType={checkoutShipping}
        onOrderCreated={handleOrderCreated}
      />

      {/* 5. WORKSHOP BOOKING MODAL */}
      <WorkshopModal
        isOpen={isWorkshopOpen}
        onClose={() => setIsWorkshopOpen(false)}
      />

      {/* 6. ORDERS HISTORY MODAL */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />

      {/* 7. ADMIN DRAWER */}
      <AdminDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

    </div>
  );
}
