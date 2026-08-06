import http from 'http';
import app from './app.js';
import { config } from './config/index.js';
import { connectDB } from './config/database.js';
import { initSocket } from './config/socket.js';
import { initFirebase } from './config/firebase.js';
import { logger } from './config/logger.js';
import { setupSocketHandlers } from './socket/socketHandler.js';

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Initialize Firebase Admin
    initFirebase();

    // 3. Setup HTTP Server
    const server = http.createServer(app);

    // 4. Initialize Socket.IO
    const io = initSocket(server);
    setupSocketHandlers(io);

    // 5. Start listening
    server.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`);
      logger.info(`Swagger docs available at http://localhost:${config.PORT}/api-docs`);
    });

    // Graceful shutdown
    const shutdown = () => {
      logger.info('Shutting down server...');
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
