import React from 'react';
import { 
  Store, 
  Calendar, 
  ShoppingBag, 
  Clock, 
  Smartphone 
} from 'lucide-react';

interface BottomNavProps {
  activeTab: 'catalog' | 'workshop' | 'orders' | 'admin';
  onSelectTab: (tab: 'catalog' | 'workshop' | 'orders' | 'admin') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAPKHub: () => void;
  isInstalled: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  onOpenAPKHub,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 pb-safe flex justify-around items-center">
      
      {/* Tienda */}
      <button
        onClick={() => onSelectTab('catalog')}
        className={`flex flex-col items-center gap-0.5 p-1.5 transition-colors ${
          activeTab === 'catalog' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Store className="w-5 h-5" />
        <span className="text-[10px]">Tienda</span>
      </button>

      {/* Taller / Citas */}
      <button
        onClick={() => onSelectTab('workshop')}
        className={`flex flex-col items-center gap-0.5 p-1.5 transition-colors ${
          activeTab === 'workshop' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span className="text-[10px]">Taller</span>
      </button>

      {/* Carrito */}
      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center gap-0.5 p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px]">Carrito</span>
        {cartCount > 0 && (
          <span className="absolute top-0.5 right-2 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-slate-950">
            {cartCount}
          </span>
        )}
      </button>

      {/* Pedidos */}
      <button
        onClick={() => onSelectTab('orders')}
        className={`flex flex-col items-center gap-0.5 p-1.5 transition-colors ${
          activeTab === 'orders' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Clock className="w-5 h-5" />
        <span className="text-[10px]">Pedidos</span>
      </button>

      {/* APK Hub / Instalador */}
      <button
        onClick={onOpenAPKHub}
        className="flex flex-col items-center gap-0.5 p-1.5 text-amber-400 transition-colors relative"
      >
        <div className="relative">
          <Smartphone className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        </div>
        <span className="text-[10px] font-black text-amber-300">APK</span>
      </button>

    </nav>
  );
};
