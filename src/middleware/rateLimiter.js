import rateLimit from 'express-rate-limit';
import { ErrorCodes } from '../shared/errors/errorCodes.js';
import { AppError } from '../shared/errors/AppError.js';

const handler = (req, res, next) => {
  next(new AppError('Too many requests', 429, ErrorCodes.RATE_LIMIT_EXCEEDED));
};

export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  handler
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  handler
});

export const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  handler
});
