import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin' | 'rider';
  phone?: string;
  avatar?: string;
  image?: string;
  lifetimeSpend: number;
  membershipTier: 'silver' | 'gold' | 'platinum';
  createdAt: Date;
  updatedAt: Date;
  referralCode: string;
  referredBy?: string;
  kycStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  kycDetails?: {
    idType?: string;
    idNumber?: string;
    licenseNumber?: string;
    vehicleType?: string;
    vehiclePlate?: string;
    verifiedAt?: Date;
    rejectedReason?: string;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    index: true
  },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['user', 'admin', 'rider'], 
    default: 'user' 
  },
  phone: String,
  avatar: String,
  image: String,
  kycStatus: {
    type: String,
    enum: ['none', 'pending', 'verified', 'rejected'],
    default: 'none',
    index: true
  },
  kycDetails: {
    idType: String,
    idNumber: String,
    licenseNumber: String,
    vehicleType: String,
    vehiclePlate: String,
    verifiedAt: Date,
    rejectedReason: String
  },
  lifetimeSpend: { type: Number, default: 0 },
  membershipTier: { 
    type: String, 
    enum: ['silver', 'gold', 'platinum'], 
    default: 'silver' 
  },
  referralCode: { type: String, unique: true, index: true },
  referredBy: { type: String, index: true }
}, {
  timestamps: true
});

UserSchema.pre('save', async function () {
  const doc = this as IUser;
  
  // 1. Password Hashing
  if (doc.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    doc.password = await bcrypt.hash(doc.password, salt);
  }

  // 2. Referral Code Generation
  if (!doc.referralCode) {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    doc.referralCode = `${doc.name?.split(' ')[0]?.toUpperCase() || 'PET'}-${random}`;
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
