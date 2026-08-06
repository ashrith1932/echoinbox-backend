import { MessageRepository } from './message.repository.js';
import { PairingRepository } from '../pairings/pairing.repository.js';
import { ForbiddenError } from '../../shared/errors/AppError.js';
import { getIO } from '../../config/socket.js';

export class MessageService {
  static async send(data) {
    const pairing = await PairingRepository.findById(data.pairingId);
    if (!pairing || pairing.status !== 'active') {
      throw new ForbiddenError('Pairing is not active');
    }

    const message = await MessageRepository.create({
      ...data,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days TTL
    });

    try {
      const io = getIO();
      io.to(data.receiverDeviceId).emit('new_message', { messageId: message._id });
    } catch (err) {
      console.error('Failed to emit socket event:', err);
    }

    return message;
  }

  static async getPending(receiverDeviceId) {
    return MessageRepository.findPending(receiverDeviceId);
  }

  static async getByPairing(pairingId, limit, skip) {
    return MessageRepository.findByPairing(pairingId, limit, skip);
  }

  static async acknowledge(messageId, status) {
    const fieldName = status === 'read' ? 'readAt' : 'deliveredAt';
    return MessageRepository.markStatus(messageId, status, fieldName);
  }

  static async bulkDelete(messageIds) {
    return MessageRepository.bulkDelete(messageIds);
  }
}
