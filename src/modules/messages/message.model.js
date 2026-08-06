import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderDeviceId: { type: String, required: true },
  receiverDeviceId: { type: String, required: true },
  pairingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pairing', required: true },
  encryptedPayload: { type: String, required: true },
  ephemeralPublicKey: { type: String, required: true },
  iv: { type: String, required: true },
  authTag: { type: String, required: true },
  nonce: { type: String, required: true, unique: true },
  metadata: {
    senderIdHash: String,
    messageType: String,
    originalTimestamp: Date,
    payloadSize: Number
  },
  status: { type: String, enum: ['pending', 'delivered', 'read', 'failed', 'expired'], default: 'pending' },
  deliveredAt: { type: Date },
  readAt: { type: Date },
  expiresAt: { type: Date, required: true },
  retryCount: { type: Number, default: 0 }
}, { timestamps: true });

messageSchema.index({ receiverDeviceId: 1, status: 1, createdAt: -1 });
messageSchema.index({ pairingId: 1, createdAt: -1 });
messageSchema.index({ nonce: 1 }, { unique: true });
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Message = mongoose.model('Message', messageSchema);
