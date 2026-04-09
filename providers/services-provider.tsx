import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';

import { hasClerkConfig } from '@/lib/clerk';
import { hasSupabaseConfig, supabase } from '@/lib/supabase';

type ServicesContextValue = {
  supabase: typeof supabase;
  hasClerkConfig: boolean;
  hasSupabaseConfig: boolean;
};

const ServicesContext = createContext<ServicesContextValue | null>(null);

export function ServicesProvider({ children }: PropsWithChildren) {
  const value = useMemo(
    () => ({
      supabase,
      hasClerkConfig,
      hasSupabaseConfig,
    }),
    [],
  );

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

export function useServices() {
  const context = useContext(ServicesContext);

  if (!context) {
    throw new Error('useServices must be used within ServicesProvider');
  }

  return context;
}
