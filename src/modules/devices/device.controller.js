import { DeviceService } from './device.service.js';

export class DeviceController {
  static async register(req, res, next) {
    try {
      const deviceId = req.headers['x-device-id'] || req.body.deviceId;
      const device = await DeviceService.registerDevice({ ...req.body, deviceId });
      res.status(201).json({ success: true, data: device });
    } catch (err) { next(err); }
  }

  static async updateFcmToken(req, res, next) {
    try {
      const deviceId = req.headers['x-device-id'] || req.params.id;
      const device = await DeviceService.updateFcmToken(deviceId, req.body.fcmToken);
      res.status(200).json({ success: true, data: device });
    } catch (err) { next(err); }
  }

  static async updatePublicKey(req, res, next) {
    try {
      const deviceId = req.headers['x-device-id'] || req.params.id;
      const device = await DeviceService.updatePublicKey(deviceId, req.body.publicKey);
      res.status(200).json({ success: true, data: device });
    } catch (err) { next(err); }
  }

  static async listDevices(req, res, next) {
    try {
      const deviceId = req.headers['x-device-id'] || req.user?.deviceId;
      const devices = await DeviceService.listUserDevices(deviceId);
      res.status(200).json({ success: true, data: devices });
    } catch (err) { next(err); }
  }

  static async deactivate(req, res, next) {
    try {
      await DeviceService.deactivateDevice(req.params.id);
      res.status(200).json({ success: true, message: 'Device deactivated' });
    } catch (err) { next(err); }
  }
}
