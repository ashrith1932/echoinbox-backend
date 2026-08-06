import argon2 from 'argon2';
import { AuthRepository } from './auth.repository.js';
import { SessionService } from '../sessions/session.service.js';
import { SessionRepository } from '../sessions/session.repository.js';
import { AuthError, ConflictError } from '../../shared/errors/AppError.js';

export class AuthService {
  static async register({ email, password, displayName, deviceId, role, ipAddress, userAgent }) {
    const existingUser = await AuthRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const user = await AuthRepository.create({ email, passwordHash, displayName });

    const { accessToken, refreshToken } = await SessionService.createSession({
      userId: user._id,
      deviceId,
      role,
      ipAddress,
      userAgent
    });

    return { user: { id: user._id, email: user.email, displayName: user.displayName }, accessToken, refreshToken };
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

    const { accessToken, refreshToken } = await SessionService.createSession({
      userId: user._id,
      deviceId,
      role,
      ipAddress,
      userAgent
    });

    return { user: { id: user._id, email: user.email, displayName: user.displayName }, accessToken, refreshToken };
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
