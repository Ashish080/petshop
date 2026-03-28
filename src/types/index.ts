import { Document } from 'mongoose';

// Product Types
export interface Product {
  _id: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  category: 'food' | 'toys' | 'grooming' | 'accessories' | 'health' | 'bedding';
  images: string[];
  stock: number;
  lowStockThreshold: number;
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isLowStock: boolean;
}

export interface ProductVariant {
  name: string;
  sku: string;
  price: number;
  stock: number;
}

// Cart Types
export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantName?: string;
  /** When set, quantity cannot exceed this (main product stock) */
  stock?: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  delivery: number;
  total: number;
  itemCount: number;
}

// Order Types (aligned with `models/Order` + API responses)
export interface OrderItem {
  productId?: string;
  product?: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  variantName?: string;
  variant?: { variantName?: string; selectedOption?: string };
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode?: string;
  pincode?: string;
  country?: string;
  name?: string;
  phone?: string;
}

export interface Order {
  _id: string;
  id?: string;
  orderNumber?: string;
  user: string | { email: string; name?: string; phone?: string };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  /** Primary total from DB */
  total: number;
  /** Legacy alias used in some UI */
  totalPrice?: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: 'cod' | 'upi' | 'card';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Admin Stats Types
export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockProducts: number;
  recentOrders: Order[];
}
