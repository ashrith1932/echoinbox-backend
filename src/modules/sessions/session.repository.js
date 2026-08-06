import { Session } from './session.model.js';

export class SessionRepository {
  static async create(sessionData) {
    return Session.create(sessionData);
  }

  static async findByTokenHash(refreshTokenHash) {
    return Session.findOne({ refreshTokenHash });
  }

  static async revokeSession(sessionId, reason = 'manual_logout') {
    return Session.findByIdAndUpdate(sessionId, { isRevoked: true, revokedReason: reason });
  }

  static async revokeFamily(tokenFamily, reason = 'reuse_detected') {
    return Session.updateMany({ tokenFamily }, { isRevoked: true, revokedReason: reason });
  }

  static async revokeAllUserSessions(userId) {
    return Session.updateMany({ userId }, { isRevoked: true, revokedReason: 'logout_all' });
  }
}
