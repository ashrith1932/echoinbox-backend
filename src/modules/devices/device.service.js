import { DeviceRepository } from './device.repository.js';
import { NotFoundError } from '../../shared/errors/AppError.js';

export class DeviceService {
  static async registerDevice(data) {
    return DeviceRepository.createOrUpdate(data);
  }

  static async updateFcmToken(deviceId, fcmToken) {
    return DeviceRepository.update(deviceId, { 
      fcmToken, 
      fcmTokenUpdatedAt: new Date(),
      lastSeenAt: new Date()
    });
  }

  static async updatePublicKey(deviceId, publicKey) {
    return DeviceRepository.update(deviceId, { 
      publicKey, 
      publicKeyUpdatedAt: new Date(),
      lastSeenAt: new Date()
    });
  }

  static async listUserDevices(deviceId) {
    return DeviceRepository.findByUserId(deviceId);
  }

  static async deactivateDevice(deviceId) {
    const device = await DeviceRepository.deactivate(deviceId);
    if (!device) {
      throw new NotFoundError('Device not found');
    }
  }
}
