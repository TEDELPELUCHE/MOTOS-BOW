import React, { useState } from 'react';
import { ShoppingBag, Check, Star, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetails?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const [addedAnim, setAddedAnim] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      onClick={() => onViewDetails && onViewDetails(product)}
      className="bg-slate-900/90 border border-slate-800/90 hover:border-amber-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 group cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-950">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // fallback image
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Gradient Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

        {/* Category & Brand pill */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-slate-800">
            {product.brand}
          </span>
          {discountPercent > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-rose-500/90 backdrop-blur-md text-[10px] font-black text-white">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-slate-800">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
        </div>

        {/* Compatibility pill at bottom of image */}
        {product.compatibility && product.compatibility.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 truncate text-[10px] text-slate-300 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-800/80 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">Para: {product.compatibility[0]}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-100 line-clamp-2 leading-tight group-hover:text-amber-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to cart */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            {product.originalPrice && (
              <span className="text-[10px] text-slate-500 line-through block leading-none">
                ${product.originalPrice.toLocaleString('es-CO')}
              </span>
            )}
            <span className="text-sm sm:text-base font-black text-amber-400 tracking-tight">
              ${product.price.toLocaleString('es-CO')}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
              addedAnim
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30'
            }`}
            title="Agregar al carrito"
          >
            {addedAnim ? (
              <>
                <Check className="w-4 h-4 text-slate-950 font-bold" />
                <span className="hidden sm:inline">¡Listo!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
