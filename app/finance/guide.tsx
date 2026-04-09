import * as Linking from 'expo-linking';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import plansData from '@/data/oshc-plans.json';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { OshcPlan } from '@/types/oshc';

const plans = plansData as OshcPlan[];
const checklistKeys = ['one', 'two', 'three', 'four'] as const;

export default function FinanceGuideScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <SectionHeading title={t('finance.guideTitle')} description={t('finance.guideBody')} />
      <Card className="gap-3">
        {checklistKeys.map((key, index) => (
          <Text key={key} className="font-body text-[15px] leading-7 text-ink">
            {index + 1}. {t(`finance.guideChecklist.${key}`)}
          </Text>
        ))}
      </Card>
      {plans.map((plan) => (
        <Card key={plan.id} className="gap-3">
          <View>
            <Text className="font-display text-[28px] text-ink">{plan.provider}</Text>
            <Text className="font-body text-[14px] text-muted">{plan.supportPhone}</Text>
          </View>
          <Button label={t('common.call')} onPress={() => Linking.openURL(`tel:${plan.supportPhone}`)} />
        </Card>
      ))}
    </Screen>
  );
}
