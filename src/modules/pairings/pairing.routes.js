import { Router } from 'express';
import { PairingController } from './pairing.controller.js';
import { validateRequest } from '../../middleware/validator.js';
import { authenticate } from '../../middleware/authenticate.js';
import { initiateSchema, acceptSchema, approveSchema } from './pairing.validation.js';

const router = Router();
router.use(authenticate);

router.post('/initiate', validateRequest(initiateSchema), PairingController.initiate);
router.post('/accept', validateRequest(acceptSchema), PairingController.accept);
router.post('/approve', validateRequest(approveSchema), PairingController.approve);
router.post('/:id/revoke', PairingController.revoke);
router.get('/', PairingController.list);

export default router;
