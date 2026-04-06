import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWalletTransaction {
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  orderId?: string;
  createdAt: Date;
}

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId | string;
  userEmail: string;
  balance: number;
  transactions: IWalletTransaction[];
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
  userEmail: { type: String, required: true, index: true },
  balance: { type: Number, default: 0, min: 0 },
  transactions: [{
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Audit index
WalletSchema.index({ userId: 1, 'transactions.createdAt': -1 });
WalletSchema.index({ userEmail: 1, 'transactions.createdAt': -1 });

const Wallet: Model<IWallet> = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);
export default Wallet;
