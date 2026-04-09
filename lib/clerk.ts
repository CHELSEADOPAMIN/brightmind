import * as SecureStore from 'expo-secure-store';

export const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
export const hasClerkConfig = clerkPublishableKey.length > 0;

export const clerkTokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Presentation-first MVP: swallow storage errors and keep demo flow moving.
    }
  },
};
