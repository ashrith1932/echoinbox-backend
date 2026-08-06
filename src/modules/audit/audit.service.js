import { AuditRepository } from './audit.repository.js';

export class AuditService {
  static async logAction(data) {
    AuditRepository.log(data).catch(err => console.error('Failed to write audit log:', err));
  }

  static async getLogs(userId, filters = {}, limit = 50, skip = 0) {
    return AuditRepository.query({ userId, ...filters }, limit, skip);
  }
}
