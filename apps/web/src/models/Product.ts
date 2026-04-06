import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  /** Matches static catalog ids (e.g. p1, p2) used on /products when not using Mongo _id */
  catalogId?: string;
  sku?: string;
  name: string;
  description: string;
  buyPrice: number;
  price: number; // Mapping to sellPrice
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
  demandCount: number;
  createdAt: Date;
  updatedAt: Date;
  isLowStock: boolean;
}

const ProductSchema = new Schema<IProduct>({
  sku: { type: String, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  buyPrice: { type: Number, default: 0 },
  price: { type: Number, required: true, min: 0 }, // sellPrice
  category: { 
    type: String, 
    required: true, 
    enum: [
      'Pets', 'Food', 'Accessories', 'Medicine', 'Grooming', 'Toys', 'Bedding', 'Health', 'Other'
    ],
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
  isActive: { type: Boolean, default: true, index: true },
  tags: [{ type: String }],
  demandCount: { type: Number, default: 0, index: -1 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for isLowStock
ProductSchema.virtual('isLowStock').get(function() {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

// ── Compound Indexes ────────────────────────────────────────────────────────
// Browsing by category
ProductSchema.index({ category: 1, isActive: 1, createdAt: -1 });
// Search results sort by demand/popular
ProductSchema.index({ isActive: 1, demandCount: -1, rating: -1 });
// Text search
ProductSchema.index({ name: 'text', description: 'text' });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
