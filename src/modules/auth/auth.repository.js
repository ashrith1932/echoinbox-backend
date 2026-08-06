import { User } from './auth.model.js';

export class AuthRepository {
  static async create(userData) {
    return User.create(userData);
  }

  static async findByEmail(email) {
    return User.findOne({ email });
  }

  static async findById(id) {
    return User.findById(id);
  }

  static async updatePassword(id, passwordHash) {
    return User.findByIdAndUpdate(id, { passwordHash });
  }
}
