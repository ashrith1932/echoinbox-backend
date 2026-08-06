import { logger } from '../config/logger.js';
import { AppError } from '../shared/errors/AppError.js';

export const errorHandler = (err, req, res, next) => {
  let { statusCode, message, errorCode, details } = err;

  if (!(err instanceof AppError)) {
    statusCode = 500;
    message = 'Internal Server Error';
    errorCode = 'INTERNAL_SERVER_ERROR';
    logger.error({ err }, 'Unhandled exception');
  } else if (statusCode >= 500) {
    logger.error({ err }, 'Operational error');
  }

  res.status(statusCode || 500).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details && { details })
    }
  });
};
