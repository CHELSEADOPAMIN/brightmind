import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';

const freeKeys = ['one', 'two', 'three'] as const;
const premiumKeys = ['two', 'one', 'three'] as const;

export default function PlansScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <SectionHeading title={t('membership.title')} description={t('membership.subtitle')} />
      <Card className="gap-3">
        <Badge label={t('common.free')} tone="neutral" />
        {freeKeys.map((key) => (
          <Text key={key} className="font-body text-[15px] leading-6 text-ink">• {t(`membership.freeFeatures.${key}`)}</Text>
        ))}
      </Card>
      <Card className="gap-4 border-brand bg-brandSoft">
        <Badge label={t('common.premium')} tone="brand" />
        <View className="flex-row items-end gap-2">
          <Text className="font-display text-[40px] text-ink">{t('membership.premiumPrice')}</Text>
          <Text className="pb-1 font-body text-[14px] text-muted">{t('finance.perMonth')}</Text>
        </View>
        <Text className="font-body text-[15px] leading-6 text-muted">{t('membership.premiumPlanNote')}</Text>
        <View className="rounded-[24px] border border-brand bg-white px-4 py-4">
          <Text className="font-display text-[28px] text-ink">{t('translate.voiceTitle')}</Text>
          <Text className="mt-2 font-body text-[14px] leading-6 text-muted">{t('translate.voiceSubtitle')}</Text>
        </View>
        {premiumKeys.map((key) => (
          <Text key={key} className="font-body text-[15px] leading-6 text-ink">• {t(`membership.premiumFeatures.${key}`)}</Text>
        ))}
        <Button label={t('membership.topupTitle')} onPress={() => router.push('/membership/topup')} />
      </Card>
    </Screen>
  );
}
