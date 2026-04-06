import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWalletTransaction {
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  orderId?: string;
  createdAt: Date;
}

export interface IWallet extends Document {
  userEmail: string;
  balance: number;
  transactions: IWalletTransaction[];
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>({
  userEmail: { type: String, required: true, unique: true, index: true },
  balance: { type: Number, default: 0 },
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

const Wallet: Model<IWallet> = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);
export default Wallet;
