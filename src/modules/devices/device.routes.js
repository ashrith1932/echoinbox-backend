import { Router } from 'express';
import { DeviceController } from './device.controller.js';
import { validateRequest } from '../../middleware/validator.js';
import { authenticate } from '../../middleware/authenticate.js';
import { registerDeviceSchema, updateFcmSchema, updateKeySchema } from './device.validation.js';

const router = Router();

router.use(authenticate);

router.post('/register', validateRequest(registerDeviceSchema), DeviceController.register);
router.put('/:id/fcm-token', validateRequest(updateFcmSchema), DeviceController.updateFcmToken);
router.put('/:id/public-key', validateRequest(updateKeySchema), DeviceController.updatePublicKey);
router.get('/', DeviceController.listDevices);
router.delete('/:id', DeviceController.deactivate);

export default router;
