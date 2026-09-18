import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'auth_session';

/** Session lifetime: 1 month (30 days). */
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export interface AuthUser {
  username: string;
}

export interface AuthSession {
  user: AuthUser;
  /** Auth token — will come from the real API later. */
  token: string;
  /** Unix epoch (ms) after which the session is invalid. */
  expiresAt: number;
}

export async function saveSession(session: AuthSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

/** Returns the stored session, or `null` if missing / expired. */
export async function loadSession(): Promise<AuthSession | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AuthSession;
    if (Date.now() >= session.expiresAt) {
      await clearSession();
      return null;
    }
    return session;
  } catch {
    await clearSession();
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
