import crypto from 'crypto';

export const hashString = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

export const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

export const generatePairingCode = () => {
  // Generate a 6-character alphanumeric code
  return crypto.randomBytes(4).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase();
};
