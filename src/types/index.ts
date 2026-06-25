export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'gold' | 'silver' | 'artificial';
  subcategory: 'necklace' | 'earrings' | 'rings' | 'bangles' | 'anklets' | 'bracelet' | 'pendant' | 'set';
  images: string[];
  stock: number;
  weight?: string;
  material?: string;
  occasion: string[];
  isFeatured: boolean;
  ratings: number;
  numReviews: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod';
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: PaginationMeta;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
