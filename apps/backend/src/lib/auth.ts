import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET  ?? 'dev_access';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev_refresh';
const ACCESS_EXP     = process.env.JWT_ACCESS_EXPIRES  ?? '15m';
const REFRESH_EXP    = process.env.JWT_REFRESH_EXPIRES ?? '30d';

export interface JwtPayload {
  userId: string;
  email: string;
}

export function signAccess(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP } as jwt.SignOptions);
}

export function signRefresh(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP } as jwt.SignOptions);
}

export function verifyAccess(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefresh(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
