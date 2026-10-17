import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Smartphone, 
  Send, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountPercent: number;
  shippingType: 'standard' | 'express' | 'pickup';
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountPercent,
  shippingType,
  onOrderCreated,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bogotá D.C.');
  const [paymentMethod, setPaymentMethod] = useState<'contraentrega' | 'nequi' | 'daviplata' | 'tarjeta' | 'transferencia'>('contraentrega');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = Math.round(subtotal * (discountPercent / 100));
  const shippingFee = shippingType === 'express' ? 12000 : 0;
  const total = subtotal - discount + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) return;

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `BOW-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      customerCity: city,
      items: [...items],
      subtotal,
      discount,
      shippingFee,
      total,
      paymentMethod,
      status: 'Confirmado',
      date: new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      notes,
    };

    setTimeout(() => {
      onOrderCreated(newOrder);
      setCompletedOrder(newOrder);
      setIsSubmitting(false);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    }, 600);
  };

  const sendWhatsAppOrder = (order: Order) => {
    const itemsText = order.items
      .map((i) => `• ${i.product.name} (x${i.quantity}) - $${(i.product.price * i.quantity).toLocaleString('es-CO')}`)
      .join('\n');

    const msg = `🏍️ *NUEVO PEDIDO MOTOS BOW (APK)*\n` +
      `*Orden:* ${order.id}\n` +
      `*Cliente:* ${order.customerName}\n` +
      `*Celular:* ${order.customerPhone}\n` +
      `*Dirección:* ${order.customerAddress}, ${order.customerCity}\n` +
      `*Método de Pago:* ${order.paymentMethod.toUpperCase()}\n\n` +
      `*Productos:*\n${itemsText}\n\n` +
      `*Total a Pagar:* $${order.total.toLocaleString('es-CO')}\n` +
      `_Enviado desde Motos Bow APK Android_`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/573105550199?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-base sm:text-lg text-slate-100">
              {completedOrder ? '¡Pedido Confirmado!' : 'Finalizar Pedido'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {completedOrder ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-mono text-amber-400 font-bold block">
                  Número de Orden: {completedOrder.id}
                </span>
                <h3 className="font-black text-xl text-slate-100 mt-1">¡Gracias por tu compra!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Tu pedido ha sido registrado con éxito. Despacharemos tus repuestos a {completedOrder.customerAddress}.
                </p>
              </div>

              {/* Order quick summary box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Total Facturado:</span>
                  <span className="text-amber-400">${completedOrder.total.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Método de Pago:</span>
                  <span className="capitalize text-slate-300">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Productos:</span>
                  <span className="text-slate-300">{completedOrder.items.length} ítems</span>
                </div>
              </div>

              {/* WhatsApp notification action */}
              <button
                onClick={() => sendWhatsAppOrder(completedOrder)}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Confirmar por WhatsApp con Taller</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Volver a la Tienda
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400">
                  Datos de Envío y Contacto
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Carlos Martínez"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Celular / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 310 123 4567"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Dirección de Entrega</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Calle, Carrera, Apto / Casa"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Ciudad</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400">
                  Método de Pago
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('contraentrega')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      paymentMethod === 'contraentrega'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Truck className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <span className="block leading-tight">Contra Entrega</span>
                      <span className="text-[10px] text-slate-500 font-normal">Pagas al recibir en casa</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nequi')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      paymentMethod === 'nequi'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
                    <div>
                      <span className="block leading-tight">Nequi / Daviplata</span>
                      <span className="text-[10px] text-slate-500 font-normal">Transferencia digital</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      paymentMethod === 'tarjeta'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                    <div>
                      <span className="block leading-tight">Tarjeta Débito/Crédito</span>
                      <span className="text-[10px] text-slate-500 font-normal">Datáfono o PSE</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transferencia')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      paymentMethod === 'transferencia'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <span className="block leading-tight">Bancolombia</span>
                      <span className="text-[10px] text-slate-500 font-normal">Cuenta de ahorros</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Notas para el taller o repartidor (Opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Dejar en portería, timbrar dos veces, modelo de moto Pulsar 200"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Order Summary Line */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 block">Total a Pagar ({items.length} productos)</span>
                  <span className="text-xs text-emerald-400 font-semibold">
                    {shippingType === 'standard' ? 'Envío Gratis Incluido' : 'Envío Express'}
                  </span>
                </div>
                <span className="text-lg font-black text-amber-400">
                  ${total.toLocaleString('es-CO')}
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all active:scale-98"
              >
                <span>{isSubmitting ? 'Procesando Pedido...' : 'Confirmar Pedido Ahora'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
