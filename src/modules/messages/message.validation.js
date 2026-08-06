import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    senderDeviceId: z.string().min(1),
    receiverDeviceId: z.string().min(1),
    pairingId: z.string().min(1),
    encryptedPayload: z.string().min(1),
    ephemeralPublicKey: z.string().min(1),
    iv: z.string().min(1),
    authTag: z.string().min(1),
    metadata: z.object({
      senderIdHash: z.string().optional(),
      messageType: z.string().optional(),
      originalTimestamp: z.string().optional(),
      payloadSize: z.number().optional()
    }).optional()
  })
});

export const ackSchema = z.object({
  body: z.object({
    status: z.enum(['delivered', 'read'])
  })
});
