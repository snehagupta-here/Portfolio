import {
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(nodeScrypt);

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `${salt}:${derivedKey.toString('hex')}`;
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const [salt, savedHash] = hashedPassword.split(':');

  if (!salt || !savedHash) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const savedHashBuffer = Buffer.from(savedHash, 'hex');

  if (savedHashBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(savedHashBuffer, derivedKey);
};
