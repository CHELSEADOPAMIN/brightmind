import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <Card className="mt-8 gap-4">
        <View className="gap-2">
          <Text className="font-display text-[34px] text-ink">{t('notFound.title')}</Text>
          <Text className="font-body text-[15px] leading-6 text-muted">{t('notFound.body')}</Text>
        </View>
        <Button label={t('tabs.home')} onPress={() => router.replace('/(tabs)')} />
      </Card>
    </Screen>
  );
}
