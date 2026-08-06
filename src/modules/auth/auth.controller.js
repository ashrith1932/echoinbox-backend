import crypto from 'crypto';
import { AuthService } from './auth.service.js';
import { SessionService } from '../sessions/session.service.js';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password, displayName, deviceId, role } = req.body;
      const result = await AuthService.register({
        email, password, displayName, deviceId, role,
        ipAddress: req.ip, userAgent: req.get('user-agent')
      });
      res.status(200).json({ success: true, data: result }); // Returns OTP_REQUIRED
    } catch (err) { next(err); }
  }

  static async login(req, res, next) {
    try {
      const { email, password, deviceId, role } = req.body;
      const result = await AuthService.login({
        email, password, deviceId, role,
        ipAddress: req.ip, userAgent: req.get('user-agent')
      });
      res.status(200).json({ success: true, data: result }); // Returns OTP_REQUIRED
    } catch (err) { next(err); }
  }

  static async verifyOtp(req, res, next) {
    try {
      const { email, otpCode, deviceId, role } = req.body;
      const result = await AuthService.verifyOtp({
        email, otpCode, deviceId, role,
        ipAddress: req.ip, userAgent: req.get('user-agent')
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await SessionService.rotateToken(
        refreshToken, req.ip, req.get('user-agent')
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await AuthService.logout(hashToken(refreshToken));
      }
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) { next(err); }
  }

  static async logoutAll(req, res, next) {
    try {
      await AuthService.logoutAll(req.user.userId);
      res.status(200).json({ success: true, message: 'Logged out of all sessions' });
    } catch (err) { next(err); }
  }
}
