import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: {
    email: string;
    name?: string;
    phone?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'card' | 'upi' | 'cod';
  orderStatus: 'pending' | 'placed' | 'confirmed' | 'accepted' | 'picked' | 'out-for-delivery' | 'delivered' | 'cancelled';
  riderId?: string;
  feedback?: {
    rating: number;
    comment?: string;
    createdAt: Date;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  timeline: Array<{
    status: string;
    message: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }
});

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  user: {
    email: { type: String, required: true, index: true },
    name: String,
    phone: String
  },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    required: true, 
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'cod']
  },
  orderStatus: { 
    type: String, 
    required: true, 
    enum: ['pending', 'placed', 'confirmed', 'accepted', 'picked', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  riderId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  timeline: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  notes: { type: String }
}, {
  timestamps: true
});

// ── Compound Indexes ────────────────────────────────────────────────────────
// user order history — most common query pattern
OrderSchema.index({ 'user.email': 1, createdAt: -1 });
// admin order management — filter by status + sort by newest
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
// rider assignment — find orders assigned to a rider quickly
OrderSchema.index({ riderId: 1, orderStatus: 1 });
// available orders for rider acceptance
OrderSchema.index({ orderStatus: 1, riderId: 1 });
// payment reconciliation
OrderSchema.index({ paymentStatus: 1, createdAt: -1 });

OrderSchema.pre('validate', function () {
  const doc = this as IOrder;
  if (!doc.orderNumber) {
    // Timestamp (base36) + 4 random chars = ~1.6 trillion unique combinations per second
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    doc.orderNumber = `ORD-${ts}-${rand}`;
  }
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
