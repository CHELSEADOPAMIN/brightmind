import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import plansData from '@/data/oshc-plans.json';
import { PlanCard } from '@/components/finance/PlanCard';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useUser } from '@/hooks/useUser';
import type { OshcPlan } from '@/types/oshc';

const plans = plansData as OshcPlan[];
const actionCards = [
  { key: 'browse', titleKey: 'finance.browseCompare', bodyKey: 'finance.browseBody', route: '/finance/compare' as const },
  { key: 'quiz', titleKey: 'finance.quizTitle', bodyKey: 'finance.quizBody', route: '/finance/quiz' as const },
  { key: 'guide', titleKey: 'finance.guideTitle', bodyKey: 'finance.guideBody', route: '/finance/guide' as const },
];

export default function FinanceScreen() {
  const { t } = useTranslation();
  const { isPremium } = useUser();

  return (
    <Screen>
      <Animated.View entering={FadeInDown.delay(40).duration(400)}>
        <SectionHeading title={t('finance.title')} description={t('finance.subtitle')} />
      </Animated.View>

      {actionCards.map((card, index) => (
        <Animated.View key={card.key} entering={FadeInDown.delay(100 + index * 60).duration(400)}>
          <Pressable onPress={() => router.push(card.route)}>
            <Card className="gap-2">
              {card.key === 'quiz' ? <Badge label={t('common.premium')} tone={isPremium ? 'success' : 'warning'} /> : null}
              <Text className="font-display text-[30px] text-ink">{t(card.titleKey)}</Text>
              <Text className="font-body text-[15px] leading-6 text-muted">{t(card.bodyKey)}</Text>
            </Card>
          </Pressable>
        </Animated.View>
      ))}

      <Animated.View entering={FadeInDown.delay(300).duration(400)} className="gap-4">
        <Text className="font-display text-[30px] text-ink">{t('finance.browseCompare')}</Text>
        {plans.slice(0, 2).map((plan, index) => (
          <PlanCard key={plan.id} active={index === 0} plan={plan} />
        ))}
      </Animated.View>
    </Screen>
  );
}
