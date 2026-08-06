import mongoose from 'mongoose';

const pairingSchema = new mongoose.Schema({
  senderDeviceId: { type: String, required: true },
  receiverDeviceId: { type: String },
  senderUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pairingCodeHash: { type: String, required: true },
  pairingTokenHash: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active', 'revoked', 'expired'], default: 'pending' },
  isPermanent: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
  approvedAt: { type: Date },
  revokedAt: { type: Date },
  revokedBy: { type: String },
  permissions: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

pairingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Pairing = mongoose.model('Pairing', pairingSchema);
