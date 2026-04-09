import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import i18n from '@/lib/i18n';
import type { AppLanguage, AppUser, BookingRecord, ReferralRecord } from '@/types/user';

type AppSnapshot = {
  user: AppUser | null;
  referrals: ReferralRecord[];
  bookings: BookingRecord[];
};

type AppContextValue = {
  state: AppSnapshot & { ready: boolean };
  actions: {
    signInDemo: (payload?: Partial<Pick<AppUser, 'name' | 'email' | 'language'>>) => void;
    signUpDemo: (payload: { name: string; email: string; language?: AppLanguage; referralCode?: string }) => void;
    signOut: () => void;
    upgradeToPremium: () => void;
    topUpCredits: (amount: number) => void;
    changeLanguage: (language: AppLanguage) => void;
    addBooking: (booking: Omit<BookingRecord, 'id' | 'createdAt'>) => void;
  };
  meta: {
    isAuthenticated: boolean;
    isPremium: boolean;
  };
};

const STORAGE_KEY = 'brightmind.app.snapshot';

const seededReferrals: ReferralRecord[] = [
  {
    id: 'seed-1',
    name: 'Lina',
    creditsGiven: 50,
    createdAt: '2026-04-02T10:00:00.000Z',
  },
  {
    id: 'seed-2',
    name: 'Marco',
    creditsGiven: 50,
    createdAt: '2026-04-05T10:00:00.000Z',
  },
];

const AppContext = createContext<AppContextValue | null>(null);

function buildDemoUser(payload?: Partial<Pick<AppUser, 'name' | 'email' | 'language'>>): AppUser {
  const language = payload?.language ?? 'en';

  return {
    id: 'demo-user',
    name: payload?.name ?? 'Mia Chen',
    email: payload?.email ?? 'mia@brightmind.app',
    credits: 100,
    membership: 'free',
    referralCode: 'MIA50',
    language,
    createdAt: new Date().toISOString(),
  };
}

export function AppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppSnapshot & { ready: boolean }>({
    user: null,
    referrals: seededReferrals,
    bookings: [],
    ready: false,
  });

  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (!active) {
          return;
        }

        if (stored) {
          const parsed = JSON.parse(stored) as AppSnapshot;
          setState({ ...parsed, ready: true });
          if (parsed.user?.language) {
            await i18n.changeLanguage(parsed.user.language);
          }
          return;
        }
      } catch {
        // Ignore storage corruption in demo mode.
      }

      if (active) {
        setState((current) => ({ ...current, ready: true }));
      }
    }

    void hydrate();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!state.ready) {
      return;
    }

    const snapshot: AppSnapshot = {
      user: state.user,
      referrals: state.referrals,
      bookings: state.bookings,
    };

    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [state]);

  const signInDemo = useCallback((payload?: Partial<Pick<AppUser, 'name' | 'email' | 'language'>>) => {
    const nextUser = buildDemoUser(payload);
    setState((current) => ({ ...current, user: nextUser }));
    void i18n.changeLanguage(nextUser.language);
  }, []);

  const signUpDemo = useCallback(
    (payload: { name: string; email: string; language?: AppLanguage; referralCode?: string }) => {
      const nextUser = buildDemoUser(payload);
      const referralBonus = payload.referralCode ? 50 : 0;

      setState((current) => ({
        ...current,
        user: {
          ...nextUser,
          credits: nextUser.credits + referralBonus,
        },
      }));
      void i18n.changeLanguage(nextUser.language);
    },
    [],
  );

  const actions = useMemo<AppContextValue['actions']>(
    () => ({
      signInDemo,
      signUpDemo,
      signOut: () => setState((current) => ({ ...current, user: null })),
      upgradeToPremium: () =>
        setState((current) => ({
          ...current,
          user: current.user ? { ...current.user, membership: 'premium' } : current.user,
        })),
      topUpCredits: (amount: number) =>
        setState((current) => ({
          ...current,
          user: current.user ? { ...current.user, credits: current.user.credits + amount } : current.user,
        })),
      changeLanguage: (language) => {
        setState((current) => ({
          ...current,
          user: current.user ? { ...current.user, language } : current.user,
        }));
        void i18n.changeLanguage(language);
      },
      addBooking: (booking) =>
        setState((current) => ({
          ...current,
          bookings: [
            {
              ...booking,
              id: `${booking.doctorId}-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
            ...current.bookings,
          ],
        })),
    }),
    [signInDemo, signUpDemo],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      actions,
      meta: {
        isAuthenticated: Boolean(state.user),
        isPremium: state.user?.membership === 'premium',
      },
    }),
    [actions, state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }

  return context;
}
