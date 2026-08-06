import argon2 from 'argon2';
import { AuthRepository } from './auth.repository.js';
import { SessionService } from '../sessions/session.service.js';
import { SessionRepository } from '../sessions/session.repository.js';
import { AuthError, ConflictError, ValidationError } from '../../shared/errors/AppError.js';
import { EmailService } from '../../shared/email.service.js';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const getOtpExpiry = () => new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

export class AuthService {
  static async register({ email, password, displayName, deviceId, role, ipAddress, userAgent }) {
    let user = await AuthRepository.findByEmail(email);
    if (user && user.isEmailVerified) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const otpCode = generateOtp();
    const otpExpiresAt = getOtpExpiry();

    if (!user) {
      user = await AuthRepository.create({ email, passwordHash, displayName, otpCode, otpExpiresAt });
    } else {
      user = await AuthRepository.saveOtp(user._id, otpCode, otpExpiresAt);
      await AuthRepository.updatePassword(user._id, passwordHash);
    }

    await EmailService.sendOtpEmail(email, otpCode);

    return { status: 'OTP_REQUIRED', email: user.email, message: 'OTP sent to email' };
  }

  static async login({ email, password, deviceId, role, ipAddress, userAgent }) {
    const user = await AuthRepository.findByEmail(email);
    if (!user || !user.isActive) {
      throw new AuthError('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      throw new AuthError('Invalid credentials');
    }

    const otpCode = generateOtp();
    const otpExpiresAt = getOtpExpiry();
    await AuthRepository.saveOtp(user._id, otpCode, otpExpiresAt);
    await EmailService.sendOtpEmail(email, otpCode);

    return { status: 'OTP_REQUIRED', email: user.email, message: 'OTP sent to email' };
  }

  static async verifyOtp({ email, otpCode, deviceId, role, ipAddress, userAgent }) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      throw new AuthError('Invalid email or OTP');
    }

    if (user.otpCode !== otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new AuthError('Invalid or expired OTP');
    }

    await AuthRepository.verifyEmailAndClearOtp(user._id);

    const { accessToken, refreshToken } = await SessionService.createSession({
      userId: user._id,
      deviceId,
      role,
      ipAddress,
      userAgent
    });

    return { 
      status: 'SUCCESS',
      user: { id: user._id, email: user.email, displayName: user.displayName }, 
      accessToken, 
      refreshToken 
    };
  }

  static async logout(refreshTokenHash) {
    const session = await SessionRepository.findByTokenHash(refreshTokenHash);
    if (session) {
      await SessionRepository.revokeSession(session._id, 'manual_logout');
    }
  }

  static async logoutAll(userId) {
    await SessionRepository.revokeAllUserSessions(userId);
  }
}
