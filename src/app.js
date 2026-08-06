import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import deviceRoutes from './modules/devices/device.routes.js';
import pairingRoutes from './modules/pairings/pairing.routes.js';
import messageRoutes from './modules/messages/message.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Global API Rate Limit
app.use('/api', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EchoInbox API',
      version: '1.0.0',
      description: 'API documentation for EchoInbox backend'
    },
    servers: [{ url: '/api/v1' }]
  },
  apis: ['./src/modules/**/*.routes.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/pairings', pairingRoutes);
app.use('/api/v1/pairing', pairingRoutes);
app.use('/api/v1/messages', messageRoutes);

// Error Handling
app.use(errorHandler);

export default app;
