import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
  addresses: {
    isDefault: boolean;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
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
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  phone: String,
  avatar: String,
  addresses: [{
    isDefault: { type: Boolean, default: false },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }]
}, {
  timestamps: true
});

// Hash password before saving (Mongoose 9: async middleware, no `next`)
UserSchema.pre('save', async function () {
  const doc = this as IUser;
  if (!doc.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  doc.password = await bcrypt.hash(doc.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
