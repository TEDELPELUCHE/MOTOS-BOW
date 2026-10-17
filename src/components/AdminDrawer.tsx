import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Plus, 
  Package, 
  Trash2, 
  Edit3, 
  Truck, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { Product, Order } from '../types';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  const [adminTab, setAdminTab] = useState<'orders' | 'inventory' | 'new-product'>('orders');

  // New product form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Motos Bow Pro');
  const [category, setCategory] = useState<Product['category']>('repuestos');
  const [price, setPrice] = useState(45000);
  const [stock, setStock] = useState(10);
  const [description, setDescription] = useState('');
  const [compatibility, setCompatibility] = useState('Universal');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80');

  if (!isOpen) return null;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: `mb-${Date.now()}`,
      name,
      brand,
      category,
      price: Number(price),
      stock: Number(stock),
      description,
      compatibility: compatibility.split(',').map((s) => s.trim()),
      image,
      rating: 5.0,
      reviewsCount: 1,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    onAddProduct(newProd);
    setAdminTab('inventory');
    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-100">Panel de Administración</h2>
                <p className="text-xs text-slate-400">Control de pedidos e inventario de repuestos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 gap-2">
            <button
              onClick={() => setAdminTab('orders')}
              className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                adminTab === 'orders'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Pedidos ({orders.length})
            </button>
            <button
              onClick={() => setAdminTab('inventory')}
              className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                adminTab === 'inventory'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Inventario ({products.length})
            </button>
            <button
              onClick={() => setAdminTab('new-product')}
              className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                adminTab === 'new-product'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              + Nuevo Repuesto
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            
            {/* ORDERS TAB */}
            {adminTab === 'orders' && (
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">No hay pedidos registrados aún.</p>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400">{ord.id}</span>
                        <div className="flex items-center gap-1.5">
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                            className="bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-200 rounded-lg px-2 py-1"
                          >
                            <option value="Confirmado">Confirmado</option>
                            <option value="En camino">En camino</option>
                            <option value="Entregado">Entregado</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-slate-300">
                        <span className="font-bold">{ord.customerName}</span> • {ord.customerPhone}
                        <div className="text-[11px] text-slate-400">{ord.customerAddress}, {ord.customerCity}</div>
                      </div>

                      <div className="border-t border-slate-800/80 pt-2 flex justify-between font-bold">
                        <span className="text-slate-400">{ord.items.length} ítems</span>
                        <span className="text-amber-400">${ord.total.toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* INVENTORY TAB */}
            {adminTab === 'inventory' && (
              <div className="space-y-2.5">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <img src={p.image} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-200 truncate">{p.name}</h4>
                      <p className="text-[11px] text-slate-400">{p.brand} • Stock: {p.stock}</p>
                      <span className="text-amber-400 font-bold">${p.price.toLocaleString('es-CO')}</span>
                    </div>
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* NEW PRODUCT TAB */}
            {adminTab === 'new-product' && (
              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Nombre del Repuesto/Accesorio</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Kit Cilindro y Pistón Estándar"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Marca</label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Categoría</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Product['category'])}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="repuestos">Repuestos Motor</option>
                      <option value="lubricantes">Lubricantes & Químicos</option>
                      <option value="accesorios">Cascos & Equipo</option>
                      <option value="frenos">Frenos & Suspensión</option>
                      <option value="electricos">Eléctricos & Baterías</option>
                      <option value="neumaticos">Llantas & Neumáticos</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Precio (COP)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Stock Disponible</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Compatibilidad (Separar por coma)</label>
                  <input
                    type="text"
                    value={compatibility}
                    onChange={(e) => setCompatibility(e.target.value)}
                    placeholder="Pulsar NS200, Yamaha FZ, Gixxer"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">URL de Imagen</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Descripción</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalles técnicos y material..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors"
                >
                  Guardar en Inventario
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
