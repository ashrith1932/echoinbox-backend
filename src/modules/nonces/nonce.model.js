import mongoose from 'mongoose';
import { config } from '../../config/index.js';

const nonceSchema = new mongoose.Schema({
  nonce: { type: String, required: true, unique: true },
  deviceId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: parseInt(config.NONCE_TTL_SECONDS, 10) }
});

export const Nonce = mongoose.model('Nonce', nonceSchema);
