import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISupportTicket extends Document {
  orderId: string;
  userEmail: string;
  issueType: string;
  description?: string;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>({
  orderId: { type: String, required: true, index: true },
  userEmail: { type: String, required: true, index: true },
  issueType: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['open', 'resolved', 'dismissed'], 
    default: 'open' 
  }
}, {
  timestamps: true
});

const SupportTicket: Model<ISupportTicket> = mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
export default SupportTicket;
