/**
 * MongoDB database configuration
 */
import mongoose from 'mongoose';
import { config } from './index.js';
import { logger } from './logger.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    // Retry logic
    setTimeout(connectDB, 5000);
  }
};
