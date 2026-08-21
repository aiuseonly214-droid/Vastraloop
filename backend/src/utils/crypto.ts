import crypto from 'crypto';
import { ENV } from '../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'customer' | 'owner' | 'admin';
  name: string;
}

/**
 * Hash a password using PBKDF2 with SHA-512 and unique salt
 */
export function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verify a plain text password against a stored hash and salt
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculated = hashPassword(password, salt);
  return calculated.hash === hash;
}

/**
 * Encode and sign a JWT token using HMAC-SHA256
 */
export function generateToken(payload: TokenPayload, expiresInMs: number = 7 * 24 * 60 * 60 * 1000): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor((Date.now() + expiresInMs) / 1000);
  const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ENV.JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');

  return `${base64Header}.${base64Payload}.${signature}`;
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', ENV.JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return {
      userId: decodedPayload.userId,
      email: decodedPayload.email,
      role: decodedPayload.role,
      name: decodedPayload.name
    };
  } catch {
    return null;
  }
}
