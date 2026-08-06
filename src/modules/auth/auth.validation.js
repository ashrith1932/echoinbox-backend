import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    displayName: z.string().min(2).optional(),
    deviceId: z.string().min(1),
    role: z.enum(['sender', 'receiver', 'both']).default('both')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    deviceId: z.string().min(1),
    role: z.enum(['sender', 'receiver', 'both']).default('both')
  })
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string()
  })
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otpCode: z.string().min(6).max(6),
    deviceId: z.string().min(1),
    role: z.enum(['sender', 'receiver', 'both']).default('both')
  })
});
