import { z } from 'zod';

export const registerDeviceSchema = z.object({
  body: z.object({
    deviceName: z.string().min(1),
    deviceModel: z.string().optional(),
    platform: z.string().optional(),
    osVersion: z.string().optional(),
    appVersion: z.string().optional(),
    role: z.enum(['sender', 'receiver', 'both']),
    publicKey: z.string().optional(),
    fcmToken: z.string().optional()
  })
});

export const updateFcmSchema = z.object({
  body: z.object({
    fcmToken: z.string().min(1)
  })
});

export const updateKeySchema = z.object({
  body: z.object({
    publicKey: z.string().min(1)
  })
});
