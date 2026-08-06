import { Device } from './device.model.js';

export class DeviceRepository {
  static async createOrUpdate(deviceData) {
    const { userId, deviceName, deviceModel } = deviceData;
    return Device.findOneAndUpdate(
      { userId, deviceName, deviceModel }, 
      { ...deviceData, isActive: true, lastSeenAt: new Date() },
      { new: true, upsert: true }
    );
  }

  static async findById(id) {
    return Device.findById(id);
  }

  static async findByUserId(userId) {
    return Device.find({ userId, isActive: true });
  }

  static async update(id, data) {
    return Device.findByIdAndUpdate(id, data, { new: true });
  }

  static async deactivate(id, userId) {
    return Device.findOneAndUpdate({ _id: id, userId }, { isActive: false });
  }
}
