import { useMemo, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import plansData from '@/data/oshc-plans.json';
import { CompareTable } from '@/components/finance/CompareTable';
import { PlanCard } from '@/components/finance/PlanCard';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { OshcPlan } from '@/types/oshc';

const plans = plansData as OshcPlan[];

export default function FinanceCompareScreen() {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<string[]>([plans[0]?.id, plans[1]?.id].filter(Boolean));

  const selectedPlans = useMemo(() => plans.filter((plan) => selectedIds.includes(plan.id)), [selectedIds]);

  function togglePlan(planId: string) {
    setSelectedIds((current) => {
      if (current.includes(planId)) {
        return current.filter((item) => item !== planId);
      }

      if (current.length >= 3) {
        return [...current.slice(1), planId];
      }

      return [...current, planId];
    });
  }

  return (
    <Screen>
      <SectionHeading title={t('finance.browseCompare')} description={t('finance.browseBody')} />
      <Card className="gap-3">
        <Text className="font-body text-[14px] leading-6 text-muted">{t('finance.compareHelper')}</Text>
        {plans.map((plan) => (
          <Pressable key={plan.id} onPress={() => togglePlan(plan.id)}>
            <PlanCard active={selectedIds.includes(plan.id)} plan={plan} />
          </Pressable>
        ))}
      </Card>
      <CompareTable plans={selectedPlans} />
    </Screen>
  );
}
