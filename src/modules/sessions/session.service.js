import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/index.js';
import { SessionRepository } from './session.repository.js';
import { AuthError } from '../../shared/errors/AppError.js';

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export class SessionService {
  static async createSession({ userId, deviceId, role, ipAddress, userAgent }) {
    const privateKey = config.JWT_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    const accessToken = jwt.sign(
      { userId, deviceId, role },
      privateKey,
      { algorithm: 'ES256', expiresIn: config.JWT_ACCESS_EXPIRY }
    );

    const tokenFamily = uuidv4();
    const refreshToken = jwt.sign(
      { userId, deviceId, tokenFamily },
      privateKey,
      { algorithm: 'ES256', expiresIn: config.JWT_REFRESH_EXPIRY }
    );

    const decodedRefresh = jwt.decode(refreshToken);
    const expiresAt = new Date(decodedRefresh.exp * 1000);

    const session = await SessionRepository.create({
      userId,
      deviceId,
      refreshTokenHash: hashToken(refreshToken),
      tokenFamily,
      ipAddress,
      userAgent,
      expiresAt
    });

    return { accessToken, refreshToken, session };
  }

  static async rotateToken(oldRefreshToken, ipAddress, userAgent) {
    const publicKey = config.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');
    let decoded;
    
    try {
      decoded = jwt.verify(oldRefreshToken, publicKey, { algorithms: ['ES256'] });
    } catch (err) {
      throw new AuthError('Invalid refresh token');
    }

    const tokenHash = hashToken(oldRefreshToken);
    const session = await SessionRepository.findByTokenHash(tokenHash);

    if (!session) {
      throw new AuthError('Session not found');
    }

    if (session.isRevoked) {
      // Reuse detected
      await SessionRepository.revokeFamily(session.tokenFamily);
      throw new AuthError('Security alert: Token reuse detected. All sessions revoked.');
    }

    await SessionRepository.revokeSession(session._id, 'rotated');

    const privateKey = config.JWT_PRIVATE_KEY.replace(/\\n/g, '\n');
    const accessToken = jwt.sign(
      { userId: decoded.userId, deviceId: decoded.deviceId, role: decoded.role },
      privateKey,
      { algorithm: 'ES256', expiresIn: config.JWT_ACCESS_EXPIRY }
    );

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, deviceId: decoded.deviceId, tokenFamily: session.tokenFamily },
      privateKey,
      { algorithm: 'ES256', expiresIn: config.JWT_REFRESH_EXPIRY }
    );

    const decodedNewRefresh = jwt.decode(newRefreshToken);
    
    await SessionRepository.create({
      userId: decoded.userId,
      deviceId: decoded.deviceId,
      refreshTokenHash: hashToken(newRefreshToken),
      tokenFamily: session.tokenFamily,
      ipAddress,
      userAgent,
      expiresAt: new Date(decodedNewRefresh.exp * 1000)
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
}
