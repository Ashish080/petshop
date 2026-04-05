import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPet extends Document {
  name: string;
  breed: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Other';
  age: string;
  gender: 'Male' | 'Female';
  price: number;
  image: string;
  healthStatus: string;
  description: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PetSchema = new Schema<IPet>({
  name: { type: String, required: true, trim: true },
  breed: { type: String, required: true, trim: true },
  species: { 
    type: String, 
    required: true, 
    enum: ['Dog', 'Cat', 'Bird', 'Other'],
    index: true 
  },
  age: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female'] },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  healthStatus: { type: String, required: true },
  description: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Pet: Model<IPet> = mongoose.models.Pet || mongoose.model<IPet>('Pet', PetSchema);

export default Pet;
