import { PairingService } from './pairing.service.js';

export class PairingController {
  static async initiate(req, res, next) {
    try {
      const { isPermanent } = req.body;
      const result = await PairingService.initiate(req.user.userId, req.user.deviceId, isPermanent);
      res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  static async accept(req, res, next) {
    try {
      const { pairingId, code } = req.body;
      const result = await PairingService.accept(req.user.userId, req.user.deviceId, pairingId, code);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  static async approve(req, res, next) {
    try {
      const { pairingId, token } = req.body;
      const result = await PairingService.approve(req.user.userId, pairingId, token);
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  static async revoke(req, res, next) {
    try {
      const { id } = req.params;
      await PairingService.revoke(req.user.userId, id);
      res.status(200).json({ success: true, message: 'Pairing revoked' });
    } catch (err) { next(err); }
  }

  static async list(req, res, next) {
    try {
      const pairings = await PairingService.listActive(req.user.userId);
      res.status(200).json({ success: true, data: pairings });
    } catch (err) { next(err); }
  }
}
