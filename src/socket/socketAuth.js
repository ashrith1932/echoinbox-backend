import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const socketAuthMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    const publicKey = config.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');
    const decoded = jwt.verify(token, publicKey, { algorithms: ['ES256'] });
    
    socket.user = decoded; // { userId, deviceId, role }
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};
