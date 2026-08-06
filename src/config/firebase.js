/**
 * Firebase Admin SDK configuration
 */
import admin from 'firebase-admin';
import { config } from './index.js';
import { logger } from './logger.js';

export const initFirebase = () => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.FCM_PROJECT_ID,
        clientEmail: config.FCM_CLIENT_EMAIL,
        privateKey: config.FCM_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    logger.info('Firebase Admin initialized successfully');
  } catch (error) {
    logger.error('Firebase Admin initialization failed:', error);
  }
};

export { admin as firebaseAdmin };
