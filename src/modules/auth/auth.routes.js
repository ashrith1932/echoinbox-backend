import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validateRequest } from '../../middleware/validator.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authLimiter } from '../../middleware/rateLimiter.js';
import { registerSchema, loginSchema, refreshSchema, verifyOtpSchema } from './auth.validation.js';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/login', authLimiter, validateRequest(loginSchema), AuthController.login);
router.post('/verify-otp', authLimiter, validateRequest(verifyOtpSchema), AuthController.verifyOtp);
router.post('/refresh', authLimiter, validateRequest(refreshSchema), AuthController.refreshToken);
router.post('/logout', authenticate, AuthController.logout);
router.post('/logout-all', authenticate, AuthController.logoutAll);

export default router;
