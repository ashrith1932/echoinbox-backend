import rateLimit from 'express-rate-limit';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { ErrorCodes } from '../shared/errors/errorCodes.js';
import { AppError } from '../shared/errors/AppError.js';
import { config } from '../config/index.js';

const handler = (req, res, next) => {
  next(new AppError('Too many requests', 429, ErrorCodes.RATE_LIMIT_EXCEEDED));
};

let upstashRedis = null;
if (config.UPSTASH_REDIS_REST_URL && config.UPSTASH_REDIS_REST_TOKEN) {
  upstashRedis = new Redis({
    url: config.UPSTASH_REDIS_REST_URL,
    token: config.UPSTASH_REDIS_REST_TOKEN,
  });
}

const createLimiter = (options) => {
  if (upstashRedis) {
    const limiter = new Ratelimit({
      redis: upstashRedis,
      limiter: Ratelimit.slidingWindow(options.max, `${options.windowMs} ms`),
      ephemeralCache: new Map(),
      prefix: options.prefix || '@upstash/ratelimit',
    });

    return async (req, res, next) => {
      try {
        const identifier = req.ip || 'global';
        const { success, limit, remaining, reset } = await limiter.limit(identifier);
        
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', reset);

        if (!success) {
          return handler(req, res, next);
        }
        next();
      } catch (err) {
        console.error('Upstash Rate Limit Error:', err);
        next();
      }
    };
  }

  // Fallback to in-memory
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    handler
  });
};

export const authLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 5,
  prefix: 'rl_auth'
});

export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  prefix: 'rl_api'
});

export const messageLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 60,
  prefix: 'rl_msg'
});
