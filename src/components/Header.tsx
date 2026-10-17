import React from 'react';
import { 
  Wrench, 
  Search, 
  ShoppingBag, 
  Smartphone, 
  ShieldCheck, 
  Clock, 
  Calendar,
  X
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAPKHub: () => void;
  onOpenWorkshop: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  isInstalled: boolean;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenAPKHub,
  onOpenWorkshop,
  onOpenOrders,
  onOpenAdmin,
  isInstalled,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 pt-safe transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        
        {/* LOGO & TITLE */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black tracking-wider text-base sm:text-lg leading-none bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                MOTOS BOW
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                APK Ready
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-0.5">
              Repuestos & Taller
            </p>
          </div>
        </div>

        {/* SEARCH BAR (Desktop & Tablet) */}
        <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar repuestos, aceites Motul, cascos DOT..."
            className="w-full bg-slate-900/90 text-sm text-slate-100 placeholder-slate-400 rounded-full pl-10 pr-10 py-2 border border-slate-700/80 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* HEADER ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* APK BUTTON (PROMINENT HIGHLIGHT) */}
          <button
            onClick={onOpenAPKHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/10 hover:from-amber-500/30 hover:to-amber-400/20 text-amber-400 border border-amber-500/40 text-xs font-bold transition-all shadow-sm hover:shadow-amber-500/10 relative group"
            title="Descargar o Instalar APK"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isInstalled ? 'APK Instalada' : 'Descargar APK'}
            </span>
            <span className="sm:hidden font-black text-[11px]">APK</span>
          </button>

          {/* WORKSHOP BOOKING TRIGGER */}
          <button
            onClick={onOpenWorkshop}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Taller & Citas</span>
          </button>

          {/* ORDERS HISTORY TRIGGER */}
          <button
            onClick={onOpenOrders}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Mis Pedidos</span>
          </button>

          {/* ADMIN TOGGLE */}
          <button
            onClick={onOpenAdmin}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
            title="Panel de Administración"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>

          {/* CART BUTTON */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/80 transition-all"
            aria-label="Abrir Carrito"
          >
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md animate-scale">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      <div className="md:hidden mt-2 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar repuestos, aceites, cascos..."
          className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-400 rounded-xl pl-9 pr-8 py-2 border border-slate-800 focus:outline-none focus:border-amber-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-2.5 text-slate-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
