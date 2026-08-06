import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AuthError } from '../shared/errors/AppError.js';
import { ErrorCodes } from '../shared/errors/errorCodes.js';

export const authenticate = (req, res, next) => {
  try {
    const deviceIdHeader = req.headers['x-device-id'];
    const authHeader = req.headers.authorization;

    if (deviceIdHeader) {
      req.deviceId = deviceIdHeader;
      req.user = { deviceId: deviceIdHeader, userId: deviceIdHeader };
      return next();
    }

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const publicKey = config.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');
        const decoded = jwt.verify(token, publicKey, { algorithms: ['ES256'] });
        req.user = decoded;
        req.deviceId = decoded.deviceId || decoded.userId;
        return next();
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          const error = new AuthError('Token expired');
          error.errorCode = ErrorCodes.TOKEN_EXPIRED;
          throw error;
        }
        throw new AuthError('Invalid token');
      }
    }

    throw new AuthError('Missing x-device-id or authorization header');
  } catch (error) {
    next(error);
  }
};
