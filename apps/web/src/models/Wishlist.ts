import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWishlist extends Document {
  userEmail: string;
  productId: string;
  createdAt: Date;
}

const WishlistSchema = new Schema<IWishlist>({
  userEmail: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Ensure a user can only have one of the same product in their wishlist
WishlistSchema.index({ userEmail: 1, productId: 1 }, { unique: true });

const Wishlist: Model<IWishlist> = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);
export default Wishlist;
