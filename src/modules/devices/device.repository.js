import { Device } from './device.model.js';

export class DeviceRepository {
  static async createOrUpdate(deviceData) {
    const { deviceId } = deviceData;
    return Device.findOneAndUpdate(
      { deviceId }, 
      { ...deviceData, isActive: true, lastSeenAt: new Date() },
      { new: true, upsert: true }
    );
  }

  static async findByDeviceId(deviceId) {
    return Device.findOne({ deviceId });
  }

  static async findById(id) {
    return Device.findOne({ deviceId: id }) || Device.findById(id);
  }

  static async findByUserId(userId) {
    return Device.find({ isActive: true });
  }

  static async update(deviceId, data) {
    return Device.findOneAndUpdate({ deviceId }, data, { new: true });
  }

  static async deactivate(deviceId) {
    return Device.findOneAndUpdate({ deviceId }, { isActive: false });
  }
}
