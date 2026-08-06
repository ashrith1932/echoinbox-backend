import { DeviceRepository } from './device.repository.js';
import { NotFoundError } from '../../shared/errors/AppError.js';

export class DeviceService {
  static async registerDevice(userId, data) {
    return DeviceRepository.createOrUpdate({ userId, ...data });
  }

  static async updateFcmToken(userId, deviceId, fcmToken) {
    const device = await DeviceRepository.findById(deviceId);
    if (!device || device.userId.toString() !== userId.toString()) {
      throw new NotFoundError('Device not found');
    }
    return DeviceRepository.update(deviceId, { 
      fcmToken, 
      fcmTokenUpdatedAt: new Date(),
      lastSeenAt: new Date()
    });
  }

  static async updatePublicKey(userId, deviceId, publicKey) {
    const device = await DeviceRepository.findById(deviceId);
    if (!device || device.userId.toString() !== userId.toString()) {
      throw new NotFoundError('Device not found');
    }
    return DeviceRepository.update(deviceId, { 
      publicKey, 
      publicKeyUpdatedAt: new Date(),
      lastSeenAt: new Date()
    });
  }

  static async listUserDevices(userId) {
    return DeviceRepository.findByUserId(userId);
  }

  static async deactivateDevice(userId, deviceId) {
    const device = await DeviceRepository.deactivate(deviceId, userId);
    if (!device) {
      throw new NotFoundError('Device not found');
    }
  }
}
