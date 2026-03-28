import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  /** Matches static catalog ids (e.g. p1, p2) used on /products when not using Mongo _id */
  catalogId?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  lowStockThreshold: number;
  variants: {
    name: string;
    sku: string;
    price: number;
    stock: number;
  }[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isLowStock: boolean;
}

const ProductSchema = new Schema<IProduct>({
  catalogId: { type: String, trim: true, unique: true, sparse: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { 
    type: String, 
    required: true, 
    enum: ['food', 'toys', 'grooming', 'accessories', 'health', 'bedding'],
    index: true
  },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  variants: [{
    name: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 }
  }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }]
}, {
  timestamps: true
});

// Virtual for isLowStock
ProductSchema.virtual('isLowStock').get(function() {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

// Index for text search
ProductSchema.index({ name: 'text', description: 'text' });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
