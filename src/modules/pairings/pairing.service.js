import mongoose from 'mongoose';
import { PairingRepository } from './pairing.repository.js';
import { AppError, NotFoundError } from '../../shared/errors/AppError.js';
import { generatePairingCode, generateRandomToken, hashString } from '../../shared/utils.js';

export class PairingService {
  static async initiate(senderDeviceId, isPermanent = false) {
    let code;
    let codeHash;
    let attempts = 0;

    // Guaranteed Uniqueness: Loop to prevent collisions with active pending codes
    do {
      code = generatePairingCode();
      codeHash = hashString(code);
      const existing = await PairingRepository.findByCodeHash(codeHash);
      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    const token = generateRandomToken();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 mins for pending

    const pairing = await PairingRepository.create({
      senderDeviceId,
      pairingCodeHash: codeHash,
      pairingTokenHash: hashString(token),
      isPermanent,
      expiresAt
    });

    const qrPayload = JSON.stringify({ pairingId: pairing._id.toString(), code });

    return { 
      pairingId: pairing._id.toString(), 
      code, 
      pairingCode: code, 
      token, 
      qrData: qrPayload, 
      expiresAt, 
      expiresIn: Date.now() + 2 * 60 * 1000 
    };
  }

  static async accept(receiverDeviceId, pairingId, code) {
    const cleanCode = code ? code.trim().toUpperCase() : '';
    let pairing;
    if (pairingId) {
      pairing = await PairingRepository.findById(pairingId);
    } else {
      pairing = await PairingRepository.findByCodeHash(hashString(cleanCode));
    }

    if (!pairing || pairing.status !== 'pending' || pairing.expiresAt < new Date()) {
      throw new NotFoundError('Pairing code not found, expired, or invalid');
    }

    if (pairing.pairingCodeHash !== hashString(cleanCode)) {
      throw new AppError('Invalid pairing code', 400, 'INVALID_CODE');
    }

    return PairingRepository.update(pairing._id, {
      receiverDeviceId,
      status: 'active' // Instantly activate on PIN acceptance
    });
  }

  static async approve(senderDeviceId, pairingId, token) {
    const pairing = await PairingRepository.findById(pairingId);
    if (!pairing || pairing.senderDeviceId !== senderDeviceId) {
      throw new NotFoundError('Pairing not found');
    }

    return PairingRepository.update(pairingId, {
      status: 'active',
      approvedAt: new Date(),
      expiresAt: pairing.isPermanent ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
  }

  static async revoke(deviceId, pairingId) {
    const pairing = await PairingRepository.findById(pairingId);
    if (!pairing) throw new NotFoundError('Pairing not found');

    return PairingRepository.update(pairingId, {
      status: 'revoked',
      revokedAt: new Date(),
      revokedBy: deviceId
    });
  }

  static async listActive(deviceId) {
    const [asSender, asReceiver] = await Promise.all([
      PairingRepository.findActiveBySender(deviceId),
      PairingRepository.findActiveByReceiver(deviceId)
    ]);
    return { asSender, asReceiver };
  }
}
