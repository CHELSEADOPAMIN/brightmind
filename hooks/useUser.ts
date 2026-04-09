import { useAppState } from '@/providers/app-provider';

export function useUser() {
  const { state, meta, actions } = useAppState();

  return {
    user: state.user,
    ready: state.ready,
    isAuthenticated: meta.isAuthenticated,
    isPremium: meta.isPremium,
    referrals: state.referrals,
    bookings: state.bookings,
    actions,
  };
}
