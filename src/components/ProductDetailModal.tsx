import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Star, Truck, Check, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-amber-400 border border-slate-800">
            {product.brand}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>SKU: {product.sku}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating} ({product.reviewsCount} opiniones)</span>
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100">{product.name}</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">{product.description}</p>
          </div>

          {/* Compatibility */}
          {product.compatibility && product.compatibility.length > 0 && (
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Compatibilidad Garantizada Motos Bow:
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.compatibility.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Perks list */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Envío Gratis por compras &gt; $100.000</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Garantía de 6 meses directa</span>
            </div>
          </div>

          {/* Pricing & Quantity */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Precio Unitario</span>
              <span className="text-xl font-black text-amber-400">
                ${product.price.toLocaleString('es-CO')}
              </span>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-xs text-slate-100">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAdd}
            className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
              added
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20'
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5 font-bold" />
                <span>¡Añadido al Carrito!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Agregar {quantity} al Carrito • ${(product.price * quantity).toLocaleString('es-CO')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
