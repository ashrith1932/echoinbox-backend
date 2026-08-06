import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: String, required: true },
  refreshTokenHash: { type: String, required: true },
  tokenFamily: { type: String, required: true },
  isRevoked: { type: Boolean, default: false },
  revokedReason: { type: String },
  ipAddress: String,
  userAgent: String,
  expiresAt: { type: Date, required: true, expires: 0 },
  lastUsedAt: { type: Date, default: Date.now }
}, { timestamps: true });

sessionSchema.index({ userId: 1, deviceId: 1 });

export const Session = mongoose.model('Session', sessionSchema);
