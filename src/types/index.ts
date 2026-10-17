export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'repuestos' | 'lubricantes' | 'accesorios' | 'frenos' | 'electricos' | 'neumaticos';
  brand: string;
  compatibility: string[];
  stock: number;
  image: string;
  rating: number;
  reviewsCount: number;
  sku: string;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'contraentrega' | 'nequi' | 'daviplata' | 'tarjeta' | 'transferencia';
  status: 'Pendiente' | 'Confirmado' | 'En camino' | 'Entregado';
  date: string;
  notes?: string;
}

export interface WorkshopService {
  id: string;
  name: string;
  duration: string;
  price: number;
  icon: string;
  description: string;
}
