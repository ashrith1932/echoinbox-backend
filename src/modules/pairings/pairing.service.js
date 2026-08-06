import mongoose from 'mongoose';
import { PairingRepository } from './pairing.repository.js';
import { AppError, NotFoundError } from '../../shared/errors/AppError.js';
import { generatePairingCode, generateRandomToken, hashString } from '../../shared/utils.js';

export class PairingService {
  static async initiate(senderUserId, senderDeviceId, isPermanent = false) {
    const code = generatePairingCode();
    const token = generateRandomToken();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins for pending

    const pairing = await PairingRepository.create({
      senderUserId,
      senderDeviceId,
      pairingCodeHash: hashString(code),
      pairingTokenHash: hashString(token),
      isPermanent,
      expiresAt
    });

    return { pairingId: pairing._id, code, token, expiresAt };
  }

  static async accept(receiverUserId, receiverDeviceId, pairingId, code) {
    let pairing;
    if (pairingId) {
      pairing = await PairingRepository.findById(pairingId);
    } else {
      pairing = await PairingRepository.findByCodeHash(hashString(code));
    }

    if (!pairing || pairing.status !== 'pending' || pairing.expiresAt < new Date()) {
      throw new NotFoundError('Pairing not found, expired, or not pending');
    }

    if (pairing.pairingCodeHash !== hashString(code)) {
      throw new AppError('Invalid pairing code', 400, 'INVALID_CODE');
    }

    return PairingRepository.update(pairing._id, {
      receiverUserId,
      receiverDeviceId,
      status: 'pending' // Still pending until sender approves
    });
  }

  static async approve(senderUserId, pairingId, token) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const pairing = await PairingRepository.findById(pairingId);
      if (!pairing || pairing.senderUserId.toString() !== senderUserId.toString()) {
        throw new NotFoundError('Pairing not found');
      }

      if (pairing.pairingTokenHash !== hashString(token)) {
        throw new AppError('Invalid pairing token', 400, 'INVALID_TOKEN');
      }

      const updated = await PairingRepository.update(pairingId, {
        status: 'active',
        approvedAt: new Date(),
        expiresAt: pairing.isPermanent ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }, session);

      await session.commitTransaction();
      return updated;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async revoke(userId, pairingId) {
    const pairing = await PairingRepository.findById(pairingId);
    if (!pairing) throw new NotFoundError('Pairing not found');

    if (pairing.senderUserId.toString() !== userId.toString() && pairing.receiverUserId?.toString() !== userId.toString()) {
      throw new AppError('Unauthorized to revoke this pairing', 403, 'FORBIDDEN');
    }

    return PairingRepository.update(pairingId, {
      status: 'revoked',
      revokedAt: new Date(),
      revokedBy: userId
    });
  }

  static async listActive(userId) {
    const [asSender, asReceiver] = await Promise.all([
      PairingRepository.findActiveBySender(userId),
      PairingRepository.findActiveByReceiver(userId)
    ]);
    return { asSender, asReceiver };
  }
}
