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

  static async findActiveBySender(senderUserId) {
    return Pairing.find({ senderUserId, status: 'active' });
  }

  static async findActiveByReceiver(receiverUserId) {
    return Pairing.find({ receiverUserId, status: 'active' });
  }

  static async findByCodeHash(pairingCodeHash) {
    return Pairing.findOne({ pairingCodeHash, status: 'pending' });
  }
}
