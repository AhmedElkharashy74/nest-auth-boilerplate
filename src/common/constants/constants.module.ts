// common/constants.ts
export const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
export const BCRYPT_ROUNDS = 10;