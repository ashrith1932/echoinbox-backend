import { logger } from '../config/logger.js';
import { SocketEvents } from './events.js';
import { socketAuthMiddleware } from './socketAuth.js';
import { MessageService } from '../modules/messages/message.service.js';

export const setupSocketHandlers = (io) => {
  io.use(socketAuthMiddleware);

  io.on(SocketEvents.CONNECT, (socket) => {
    logger.info(`Socket connected: ${socket.id} (Device: ${socket.user.deviceId})`);

    // Automatically join a room for this device
    socket.join(socket.user.deviceId);

    socket.on(SocketEvents.JOIN_DEVICE_ROOM, (deviceId) => {
      if (deviceId === socket.user.deviceId) {
        socket.join(deviceId);
      }
    });

    socket.on(SocketEvents.MESSAGE_ACK, async (data) => {
      try {
        const { messageId, status } = data;
        await MessageService.acknowledge(messageId, status);
      } catch (err) {
        logger.error('Socket message ack error:', err);
      }
    });

    socket.on(SocketEvents.DISCONNECT, () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
};
