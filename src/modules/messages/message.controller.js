import { MessageService } from './message.service.js';

export class MessageController {
  static async send(req, res, next) {
    try {
      const message = await MessageService.send({
        ...req.body,
        nonce: req.headers['x-nonce']
      });
      res.status(201).json({ success: true, data: message });
    } catch (err) { next(err); }
  }

  static async getPending(req, res, next) {
    try {
      const deviceId = req.headers['x-device-id'] || req.deviceId || req.user?.deviceId;
      const messages = await MessageService.getPending(deviceId);
      res.status(200).json({ success: true, data: messages });
    } catch (err) { next(err); }
  }

  static async getByPairing(req, res, next) {
    try {
      const { pairingId } = req.params;
      const limit = parseInt(req.query.limit, 10) || 50;
      const skip = parseInt(req.query.skip, 10) || 0;
      const messages = await MessageService.getByPairing(pairingId, limit, skip);
      res.status(200).json({ success: true, data: messages });
    } catch (err) { next(err); }
  }

  static async acknowledge(req, res, next) {
    try {
      const { status } = req.body;
      const message = await MessageService.acknowledge(req.params.id, status);
      res.status(200).json({ success: true, data: message });
    } catch (err) { next(err); }
  }

  static async bulkDelete(req, res, next) {
    try {
      const { messageIds } = req.body;
      await MessageService.bulkDelete(messageIds);
      res.status(200).json({ success: true, message: 'Messages deleted' });
    } catch (err) { next(err); }
  }
}
