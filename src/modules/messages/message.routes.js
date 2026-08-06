import { Router } from 'express';
import { MessageController } from './message.controller.js';
import { validateRequest } from '../../middleware/validator.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validateNonce } from '../../middleware/nonceValidator.js';
import { messageLimiter } from '../../middleware/rateLimiter.js';
import { sendMessageSchema, ackSchema } from './message.validation.js';

const router = Router();
router.use(authenticate);

router.post('/', messageLimiter, validateNonce, validateRequest(sendMessageSchema), MessageController.send);
router.get('/pending', MessageController.getPending);
router.get('/pairing/:pairingId', MessageController.getByPairing);
router.post('/:id/ack', validateRequest(ackSchema), MessageController.acknowledge);
router.delete('/', MessageController.bulkDelete);

export default router;
