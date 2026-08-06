import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceName: { type: String, required: true },
  deviceModel: { type: String },
  platform: { type: String, default: 'android' },
  osVersion: { type: String },
  appVersion: { type: String },
  role: { type: String, enum: ['sender', 'receiver', 'both'], default: 'both' },
  publicKey: { type: String },
  publicKeyUpdatedAt: { type: Date },
  fcmToken: { type: String },
  fcmTokenUpdatedAt: { type: Date },
  lastSeenAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  isTrusted: { type: Boolean, default: false }
}, { timestamps: true });

export const Device = mongoose.model('Device', deviceSchema);
