import React from 'react';
import { X, Clock, Package, CheckCircle2, Truck, ExternalLink } from 'lucide-react';
import { Order } from '../types';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-100">Mis Pedidos</h2>
              <p className="text-xs text-slate-400">Historial y estado de entrega de repuestos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 sm:p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {orders.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500 border border-slate-700">
                <Package className="w-7 h-7" />
              </div>
              <p className="text-xs text-slate-400">No tienes pedidos recientes registrados.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400">{ord.id}</span>
                    <span className="text-[10px] text-slate-400 block">{ord.date}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    <span>{ord.status}</span>
                  </span>
                </div>

                <div className="border-y border-slate-800/80 py-2 space-y-1 text-xs text-slate-300">
                  {ord.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-[11px]">
                      <span className="truncate max-w-[240px]">
                        {i.quantity}x {i.product.name}
                      </span>
                      <span className="font-bold text-slate-200">
                        ${(i.product.price * i.quantity).toLocaleString('es-CO')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-400">
                    <span>Destino: </span>
                    <span className="text-slate-200">{ord.customerAddress}, {ord.customerCity}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total</span>
                    <span className="font-black text-sm text-amber-400">
                      ${ord.total.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
