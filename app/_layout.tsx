import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond';
import { Manrope_500Medium, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import 'react-native-reanimated';

import '@/lib/i18n';
import '../global.css';

import { Screen } from '@/components/ui/Screen';
import { AppProvider, useAppState } from '@/providers/app-provider';
import { ServicesProvider } from '@/providers/services-provider';
import { TranslationProvider } from '@/providers/translation-provider';

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

function LoadingScreen() {
  const { t } = useTranslation();

  return (
    <Screen scroll={false}>
      <View className="flex-1 items-center justify-center gap-3">
        <Text className="font-display text-[40px] text-brand">BrightMind</Text>
        <Text className="font-body text-[14px] uppercase tracking-[2px] text-muted">{t('common.presentationReady')}</Text>
      </View>
    </Screen>
  );
}

function RouteGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { state, meta } = useAppState();
  const { t } = useTranslation();

  useEffect(() => {
    if (!state.ready) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!meta.isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
      return;
    }

    if (meta.isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [meta.isAuthenticated, router, segments, state.ready]);

  if (!state.ready) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#fff8f6' },
          headerTintColor: '#191412',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#fff8f6' },
          headerTitleStyle: { fontFamily: 'Manrope_700Bold' },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="finance/compare" options={{ title: t('finance.browseCompare') }} />
        <Stack.Screen name="finance/quiz" options={{ title: t('finance.quizTitle') }} />
        <Stack.Screen name="finance/guide" options={{ title: t('finance.guideTitle') }} />
        <Stack.Screen name="doctor/[id]" options={{ title: t('tabs.doctor') }} />
        <Stack.Screen name="doctor/book" options={{ title: t('doctor.bookTitle') }} />
        <Stack.Screen name="translate/voice" options={{ title: t('translate.voiceTitle') }} />
        <Stack.Screen name="membership/plans" options={{ title: t('membership.plansTitle') }} />
        <Stack.Screen name="membership/topup" options={{ title: t('membership.topupTitle') }} />
        <Stack.Screen name="membership/referral" options={{ title: t('membership.referralTitle') }} />
        <Stack.Screen name="+not-found" options={{ title: t('notFound.title') }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    CormorantGaramond_600SemiBold,
    Manrope_500Medium,
    Manrope_700Bold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ServicesProvider>
      <AppProvider>
        <TranslationProvider>
          <RouteGuard />
        </TranslationProvider>
      </AppProvider>
    </ServicesProvider>
  );
}
