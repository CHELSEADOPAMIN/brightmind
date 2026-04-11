import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

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
        <SectionHeading eyebrow={t('common.mockMode')} title={`${t('home.greeting')}, ${user?.name ?? 'Student'}`} />
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
