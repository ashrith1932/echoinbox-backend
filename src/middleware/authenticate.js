import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AuthError } from '../shared/errors/AppError.js';
import { ErrorCodes } from '../shared/errors/errorCodes.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthError('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const publicKey = config.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');
      const decoded = jwt.verify(token, publicKey, { algorithms: ['ES256'] });
      req.user = decoded; // expected to have { userId, deviceId, ... }
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const error = new AuthError('Token expired');
        error.errorCode = ErrorCodes.TOKEN_EXPIRED;
        throw error;
      }
      throw new AuthError('Invalid token');
    }
  } catch (error) {
    next(error);
  }
};
