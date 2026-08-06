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

  static async saveOtp(id, otpCode, otpExpiresAt) {
    return User.findByIdAndUpdate(id, { otpCode, otpExpiresAt }, { new: true });
  }

  static async verifyEmailAndClearOtp(id) {
    return User.findByIdAndUpdate(id, {
      isEmailVerified: true,
      $unset: { otpCode: "", otpExpiresAt: "" }
    }, { new: true });
  }
}
