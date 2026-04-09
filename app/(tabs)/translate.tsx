import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { PremiumGate } from '@/components/PremiumGate';
import { TextTranslator } from '@/components/translate/TextTranslator';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useUser } from '@/hooks/useUser';

export default function TranslateScreen() {
  const { t } = useTranslation();
  const { isPremium } = useUser();

  return (
    <Screen>
      <SectionHeading
        description={t('translate.subtitle')}
        title={t('translate.title')}
        titleAdjustsFontSizeToFit
        titleClassName="text-[28px] leading-[32px]"
        titleNumberOfLines={1}
      />
      <TextTranslator />
      {isPremium ? (
        <Pressable onPress={() => router.push('/translate/voice')}>
          <Card className="gap-2 border-brand bg-brandSoft">
            <Badge label={t('common.premium')} tone="brand" />
            <Text className="font-display text-[30px] text-ink">{t('translate.voiceTitle')}</Text>
            <Text className="font-body text-[15px] leading-6 text-muted">{t('translate.voiceSubtitle')}</Text>
          </Card>
        </Pressable>
      ) : (
        <PremiumGate
          onUpgrade={() => router.push('/membership/plans')}
          previewDescription={t('translate.voiceSubtitle')}
          previewTitle={t('translate.voiceTitle')}
        >
          <View />
        </PremiumGate>
      )}
    </Screen>
  );
}
