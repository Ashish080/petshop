export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  variants?: ProductVariant[];
  rating: number;
  reviews: number;
  isBestSeller: boolean;
  isFeatured: boolean;
  sku: string;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  name: string;
  type: 'size' | 'weight' | 'color' | 'flavor';
  options: VariantOption[];
}

export interface VariantOption {
  value: string;
  priceAdjustment: number;
  stock: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: {
    variantName: string;
    selectedOption: string;
  };
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}
