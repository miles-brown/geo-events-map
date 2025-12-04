import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export async function signup(data: SignupData): Promise<{ user: AuthUser; token: string }> {
  const db = await getDb();
  const existing = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
  if (existing.length > 0) throw new Error('User already exists');

  const passwordHash = await hashPassword(data.password);
  const [newUser] = await db.insert(users).values({
    email: data.email,
    passwordHash,
    name: data.name,
    loginMethod: 'email',
    role: 'user',
  }).returning();

  const authUser: AuthUser = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name || '',
    role: newUser.role,
  };

  return { user: authUser, token: generateToken(authUser) };
}

export async function login(data: LoginData): Promise<{ user: AuthUser; token: string }> {
  const db = await getDb();
  const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
  if (!user) throw new Error('Invalid credentials');

  const isValid = await verifyPassword(data.password, user.passwordHash || '');
  if (!isValid) throw new Error('Invalid credentials');

  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name || '',
    role: user.role,
  };

  return { user: authUser, token: generateToken(authUser) };
}
