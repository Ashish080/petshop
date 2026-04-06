import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
  type: 'view' | 'add-to-cart' | 'checkout-start' | 'search';
  userEmail?: string;
  productId?: string;
  productName?: string;
  category?: string;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  type: { 
    type: String, 
    required: true, 
    enum: ['view', 'add-to-cart', 'checkout-start', 'search'],
    index: true 
  },
  userEmail: { type: String, index: true },
  productId: { type: String, index: true },
  productName: String,
  category: { type: String, index: true }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

ActivitySchema.index({ type: 1, createdAt: -1 });

const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
export default Activity;
