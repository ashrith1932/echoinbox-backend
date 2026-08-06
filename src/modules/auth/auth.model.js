import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  settings: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export const User = mongoose.model('User', authSchema);
