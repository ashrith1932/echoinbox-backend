import { Message } from './message.model.js';

export class MessageRepository {
  static async create(data) {
    return Message.create(data);
  }

  static async findPending(receiverDeviceId, limit = 50) {
    return Message.find({ receiverDeviceId, status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  static async findByPairing(pairingId, limit = 50, skip = 0) {
    return Message.find({ pairingId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  static async markStatus(id, status, fieldName) {
    return Message.findByIdAndUpdate(id, { 
      status, 
      [fieldName]: new Date() 
    }, { new: true });
  }

  static async bulkDelete(messageIds) {
    return Message.deleteMany({ _id: { $in: messageIds } });
  }
}
