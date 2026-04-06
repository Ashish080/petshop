import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  adminEmail: string;
  action: 'WALLET_ADJUSTMENT' | 'STOCK_ADJUSTMENT' | 'ORDER_MODIFICATION' | 'SYSTEM_CONFIG';
  targetId: string; // userId, productId, or orderId
  targetType: 'user' | 'product' | 'order' | 'system';
  changes: {
    before: any;
    after: any;
  };
  reason: string;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  adminEmail: { type: String, required: true, index: true },
  action: { type: String, required: true, index: true },
  targetId: { type: String, required: true, index: true },
  targetType: { type: String, required: true },
  changes: {
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
  },
  reason: { type: String, required: true },
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Retention policy index (can be used for auto-deletion after 1 year)
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
