import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
  userEmail: string;
  productId: string;
  productName: string;
  productImage: string;
  priceAtSubscription: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userEmail: { type: String, required: true, index: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: String,
  priceAtSubscription: { type: Number, required: true },
  frequency: { 
    type: String, 
    enum: ['weekly', 'bi-weekly', 'monthly'], 
    default: 'monthly' 
  },
  status: { 
    type: String, 
    enum: ['active', 'paused', 'cancelled'], 
    default: 'active',
    index: true
  },
  nextBillingDate: { type: Date, required: true }
}, {
  timestamps: true
});

const Subscription: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
export default Subscription;
