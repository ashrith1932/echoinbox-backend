import { PairingService } from './pairing.service.js';

export class PairingController {
  static async initiate(req, res, next) {
    try {
      const deviceId = req.headers['x-device-id'] || req.user?.deviceId;
      const { isPermanent } = req.body;
      const result = await PairingService.initiate(deviceId, isPermanent);
      res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  static async accept(req, res, next) {
    try {
      const deviceId = req.headers['x-device-id'] || req.user?.deviceId;
      const { pairingId, code } = req.body;
      const result = await PairingService.accept(deviceId, pairingId, code);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  static async approve(req, res, next) {
    try {
      const deviceId = req.headers['x-device-id'] || req.user?.deviceId;
      const { pairingId, token } = req.body;
      const result = await PairingService.approve(deviceId, pairingId, token);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  static async revoke(req, res, next) {
    try {
      const deviceId = req.headers['x-device-id'] || req.user?.deviceId;
      const { id } = req.params;
      await PairingService.revoke(deviceId, id);
      res.status(200).json({ success: true, message: 'Pairing revoked' });
    } catch (err) { next(err); }
  }

  static async list(req, res, next) {
    try {
      const deviceId = req.headers['x-device-id'] || req.user?.deviceId;
      const pairings = await PairingService.listActive(deviceId);
      res.status(200).json({ success: true, data: pairings });
    } catch (err) { next(err); }
  }
}
