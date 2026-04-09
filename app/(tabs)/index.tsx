import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useUser } from '@/hooks/useUser';

const featureCards = [
  { key: 'finance', route: '/(tabs)/finance' as const },
  { key: 'doctor', route: '/(tabs)/doctor' as const },
  { key: 'translate', route: '/(tabs)/translate' as const },
  { key: 'membership', route: '/membership/plans' as const },
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useUser();

  return (
    <Screen>
      <Animated.View entering={FadeInDown.delay(40).duration(400)}>
        <SectionHeading
          eyebrow={t('common.mockMode')}
          title={`${t('home.greeting')}, ${user?.name ?? 'Student'}`}
          description={t('home.heroBody')}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <Card className="gap-4 bg-brandDeep">
          <Badge label={user?.membership === 'premium' ? t('common.premium') : t('common.free')} tone="brand" />
          <Text className="font-display text-[38px] leading-[40px] text-white">{t('home.heroTitle')}</Text>
          {user?.membership !== 'premium' ? (
            <View className="gap-2 rounded-[24px] border border-brand bg-[#fff8f6] px-4 py-4">
              <Badge label={t('common.premium')} tone="brand" />
              <Text className="font-display text-[26px] text-ink">{t('translate.voiceTitle')}</Text>
              <Text className="font-body text-[14px] leading-6 text-muted">{t('finance.quizTitle')}</Text>
            </View>
          ) : null}
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="font-body text-[13px] uppercase tracking-[1.8px] text-white/70">{t('common.credits')}</Text>
              <Text className="font-bodyBold text-[26px] text-white">{user?.credits ?? 0}</Text>
            </View>
            <Button label={t('home.heroCta')} onPress={() => router.push('/membership/plans')} />
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).duration(400)}>
        <Card className="gap-3">
          <Text className="font-display text-[28px] text-ink">{t('home.tipTitle')}</Text>
          <Text className="font-body text-[15px] leading-6 text-muted">{t('home.tipBody')}</Text>
        </Card>
      </Animated.View>

      {featureCards.map((card, index) => (
        <Animated.View key={card.key} entering={FadeInDown.delay(220 + index * 60).duration(400)}>
          <Pressable onPress={() => router.push(card.route)}>
            <Card className="gap-2">
              <Text className="font-display text-[30px] text-ink">{t(`home.cards.${card.key}Title`)}</Text>
              <Text className="font-body text-[15px] leading-6 text-muted">{t(`home.cards.${card.key}Body`)}</Text>
            </Card>
          </Pressable>
        </Animated.View>
      ))}
    </Screen>
  );
}
