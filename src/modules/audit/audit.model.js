import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceId: { type: String },
  action: { type: String, required: true },
  resource: { type: String },
  resourceId: { type: String },
  metadata: {
    ipAddress: String,
    userAgent: String,
    success: { type: Boolean, default: true },
    failureReason: String
  },
  createdAt: { type: Date, default: Date.now, expires: '90d' }
});

export const AuditLog = mongoose.model('AuditLog', auditSchema);
