import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
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
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
  variant: {
    variantName: String,
    selectedOption: String
  }
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
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  notes: String
}, {
  timestamps: true
});

// Must run before validation — `required: true` on orderNumber runs before `pre('save')`
OrderSchema.pre('validate', function () {
  const doc = this as IOrder;
  if (!doc.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    doc.orderNumber = `ORD-${timestamp}-${random}`;
  }
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
