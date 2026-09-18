import { SESSION_DURATION_MS, type AuthSession } from './storage';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

/**
 * TEMPORARY mock auth.
 * TODO: replace with real API calls.
 */
const MOCK_USER = { username: 'testuser', password: '123456' };

/** In-memory registry of mock users created via sign-up (resets on app restart). */
const mockUsers = new Map<string, string>([[MOCK_USER.username, MOCK_USER.password]]);

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(() => resolve(), ms));

function createSession(username: string): AuthSession {
  return {
    user: { username },
    token: `mock-token-${Date.now()}`,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
}

export async function login({ username, password }: LoginCredentials): Promise<AuthSession> {
  await delay(500);

  const name = username.trim();
  if (mockUsers.get(name) !== password) {
    throw new Error('Invalid username or password');
  }

  return createSession(name);
}

export async function register({ username, password }: RegisterCredentials): Promise<AuthSession> {
  await delay(700);

  const name = username.trim();
  if (mockUsers.has(name)) {
    throw new Error('Username is already taken');
  }

  mockUsers.set(name, password);
  return createSession(name);
}
