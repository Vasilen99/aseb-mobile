import * as SecureStore from 'expo-secure-store';
import type { Subscription } from './types';

const keyFor = (username: string) => `subscription_${username}`;

export async function saveSubscription(username: string, sub: Subscription): Promise<void> {
  await SecureStore.setItemAsync(keyFor(username), JSON.stringify(sub));
}

export async function loadSubscription(username: string): Promise<Subscription | null> {
  const raw = await SecureStore.getItemAsync(keyFor(username));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Subscription;
  } catch {
    await clearSubscription(username);
    return null;
  }
}

export async function clearSubscription(username: string): Promise<void> {
  await SecureStore.deleteItemAsync(keyFor(username));
}
