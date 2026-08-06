import { Pairing } from './pairing.model.js';

export class PairingRepository {
  static async create(data) {
    return Pairing.create(data);
  }

  static async findById(id) {
    return Pairing.findById(id);
  }

  static async update(id, data, session = null) {
    return Pairing.findByIdAndUpdate(id, data, { new: true, session });
  }

  static async findActiveBySender(senderDeviceId) {
    return Pairing.find({ senderDeviceId, status: 'active' });
  }

  static async findActiveByReceiver(receiverDeviceId) {
    return Pairing.find({ receiverDeviceId, status: 'active' });
  }

  static async findByCodeHash(pairingCodeHash) {
    return Pairing.findOne({ pairingCodeHash, status: 'pending' });
  }
}
