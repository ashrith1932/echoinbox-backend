import { AppError } from '../shared/errors/AppError.js';
import { ErrorCodes } from '../shared/errors/errorCodes.js';
// NonceRepository will be imported from nonces module once created
// We'll require it dynamically to avoid circular dependencies during initialization if needed
import { NonceRepository } from '../modules/nonces/nonce.repository.js';

export const validateNonce = async (req, res, next) => {
  try {
    const nonce = req.headers['x-nonce'];
    const timestamp = req.headers['x-timestamp'];

    if (!nonce || !timestamp) {
      throw new AppError('Missing nonce or timestamp', 400, ErrorCodes.VALIDATION_ERROR);
    }

    const timeDiff = Math.abs(Date.now() - parseInt(timestamp, 10));
    // Reject if timestamp is older than 5 minutes
    if (timeDiff > 5 * 60 * 1000) {
      throw new AppError('Request timestamp expired', 400, ErrorCodes.REPLAY_ATTEMPT);
    }

    // Check if nonce exists in DB
    const deviceId = req.headers['x-device-id'] || req.deviceId || req.user?.deviceId || 'anonymous';
    const isUnique = await NonceRepository.createNonce(nonce, deviceId);
    if (!isUnique) {
      throw new AppError('Replay attack detected', 400, ErrorCodes.REPLAY_ATTEMPT);
    }

    next();
  } catch (error) {
    next(error);
  }
};
