import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { useUser } from '@/hooks/useUser';

export default function SignUpScreen() {
  const { t } = useTranslation();
  const { actions } = useUser();
  const [name, setName] = useState('Mia Chen');
  const [email, setEmail] = useState('mia@brightmind.app');
  const [referralCode, setReferralCode] = useState('');

  return (
    <Screen>
      <Card className="mt-6 gap-5">
        <View className="gap-2">
          <Text className="font-display text-[38px] leading-[40px] text-ink">{t('auth.signUp')}</Text>
          <Text className="font-body text-[15px] leading-6 text-muted">{t('auth.legal')}</Text>
        </View>
        <Input label={t('auth.name')} onChangeText={setName} value={name} />
        <Input autoCapitalize="none" keyboardType="email-address" label={t('auth.email')} onChangeText={setEmail} value={email} />
        <Input label={t('auth.referralCode')} onChangeText={setReferralCode} value={referralCode} />
        <Button label={t('auth.createAccount')} onPress={() => actions.signUpDemo({ name, email, referralCode })} />
      </Card>
      <View className="mt-4 gap-2">
        <Text className="font-body text-[14px] text-muted">{t('auth.alreadyHaveAccount')}</Text>
        <Link href="/(auth)/sign-in">
          <Text className="font-bodyBold text-[15px] text-brand">{t('auth.signIn')}</Text>
        </Link>
      </View>
    </Screen>
  );
}
