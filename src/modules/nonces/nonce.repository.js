import { Nonce } from './nonce.model.js';

export class NonceRepository {
  static async createNonce(nonce, deviceId) {
    try {
      await Nonce.create({ nonce, deviceId });
      return true;
    } catch (error) {
      if (error.code === 11000) return false; // Duplicate key error
      throw error;
    }
  }
}
