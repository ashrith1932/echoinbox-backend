import { z } from 'zod';

export const initiateSchema = z.object({
  body: z.object({
    isPermanent: z.boolean().default(false)
  })
});

export const acceptSchema = z.object({
  body: z.object({
    pairingId: z.string().min(1).optional(),
    code: z.string().min(6)
  })
});

export const approveSchema = z.object({
  body: z.object({
    pairingId: z.string().min(1),
    token: z.string().min(1)
  })
});
