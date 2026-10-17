import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Check, 
  Truck, 
  Store
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (discountPercent: number, shippingType: 'standard' | 'express' | 'pickup') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [shippingType, setShippingType] = useState<'standard' | 'express' | 'pickup'>('standard');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const shippingCost = shippingType === 'express' ? 12000 : 0;
  const total = subtotal - discountAmount + shippingCost;

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = coupon.trim().toUpperCase();
    if (clean === 'MOTOBOW10') {
      setDiscountPercent(10);
      setCouponMessage({ text: '¡Cupón aplicado! 10% de descuento en repuestos', isError: false });
    } else if (clean === 'BOWAPK') {
      setDiscountPercent(15);
      setCouponMessage({ text: '¡Descuento especial APK! 15% off', isError: false });
    } else {
      setCouponMessage({ text: 'Cupón no válido. Prueba con MOTOBOW10 o BOWAPK', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-100">Mi Carrito de Compras</h2>
                <span className="text-xs text-slate-400">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-rose-400 hover:text-rose-300 p-2"
                  title="Vaciar carrito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-200 text-sm">Tu carrito está vacío</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Explora nuestro catálogo de repuestos de motor, lubricantes y cascos con envío a todo el país.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Explorar Repuestos
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-3 flex gap-3 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-xs text-slate-200 truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-slate-400">{item.product.brand}</p>
                    <div className="font-black text-xs text-amber-400">
                      ${(item.product.price * item.quantity).toLocaleString('es-CO')}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1.5 bg-slate-800 px-1.5 py-1 rounded-lg border border-slate-700">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-5 h-5 flex items-center justify-center rounded text-slate-300 hover:bg-slate-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-slate-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-5 h-5 flex items-center justify-center rounded text-slate-300 hover:bg-slate-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 space-y-3">
              
              {/* Coupon Form */}
              <form onSubmit={applyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Cupón: MOTOBOW10 o BOWAPK"
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-100 uppercase rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-amber-500"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-bold rounded-xl transition-colors"
                >
                  Aplicar
                </button>
              </form>

              {couponMessage && (
                <p
                  className={`text-[11px] font-medium flex items-center gap-1 ${
                    couponMessage.isError ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  {couponMessage.text}
                </p>
              )}

              {/* Delivery method toggle */}
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setShippingType('standard')}
                  className={`p-2 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                    shippingType === 'standard'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Estándar (Gratis)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShippingType('express')}
                  className={`p-2 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                    shippingType === 'express'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Express ($12k)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShippingType('pickup')}
                  className={`p-2 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                    shippingType === 'pickup'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Retiro Taller</span>
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs text-slate-400 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-200">${subtotal.toLocaleString('es-CO')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento ({discountPercent}%)</span>
                    <span>-${discountAmount.toLocaleString('es-CO')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className={shippingCost === 0 ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                    {shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toLocaleString('es-CO')}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-slate-100 pt-1 border-t border-slate-800">
                  <span>Total</span>
                  <span className="text-amber-400">${total.toLocaleString('es-CO')}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={() => onProceedToCheckout(discountPercent, shippingType)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all active:scale-98"
              >
                <span>Continuar a Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
