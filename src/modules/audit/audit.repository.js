import { AuditLog } from './audit.model.js';

export class AuditRepository {
  static async log(data) {
    return AuditLog.create(data);
  }

  static async query(filters, limit = 50, skip = 0) {
    return AuditLog.find(filters).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }
}
