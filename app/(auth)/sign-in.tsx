import { Link } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { useUser } from '@/hooks/useUser';

export default function SignInScreen() {
  const { t } = useTranslation();
  const { actions } = useUser();

  return (
    <Screen>
      <Animated.View entering={FadeInDown.delay(60).duration(500)} className="mt-6 gap-6">
        <Text className="font-body text-[12px] uppercase tracking-[2px] text-brand">{t('common.mockMode')}</Text>
        <Text className="font-display text-[48px] leading-[48px] text-ink">{t('auth.signInTitle')}</Text>
        <Text className="font-body text-[16px] leading-7 text-muted">{t('auth.signInSubtitle')}</Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(120).duration(500)}>
        <Card className="mt-4 gap-5 border border-brand bg-brandSoft">
          <View className="gap-3">
            <Text className="font-display text-[34px] leading-[34px] text-ink">{t('auth.demoAccess')}</Text>
            <Text className="font-body text-[15px] leading-6 text-ink">{t('auth.legal')}</Text>
          </View>
          <Button label={t('auth.signIn')} onPress={() => actions.signInDemo()} />
          <Link href="/(auth)/sign-up" asChild>
            <Button label={t('auth.signUp')} variant="secondary" />
          </Link>
        </Card>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(180).duration(500)} className="mt-4 gap-2">
        <Text className="font-body text-[14px] text-muted">{t('auth.needAccount')}</Text>
        <Link href="/(auth)/sign-up">
          <Text className="font-bodyBold text-[15px] text-brand">{t('auth.createAccount')}</Text>
        </Link>
      </Animated.View>
    </Screen>
  );
}
