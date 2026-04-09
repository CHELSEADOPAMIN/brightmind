import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/format';
import type { OshcPlan } from '@/types/oshc';

type PlanCardProps = {
  plan: OshcPlan;
  active?: boolean;
};

export function PlanCard({ plan, active = false }: PlanCardProps) {
  const { t } = useTranslation();

  return (
    <Card className={active ? 'border-brand bg-brandSoft' : ''}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-2">
          <Text className="font-display text-[28px] leading-[30px] text-ink">{plan.name}</Text>
          <Text className="font-body text-[14px] text-muted">{plan.provider}</Text>
        </View>
        <Badge label={t(`finance.coverageLevels.${plan.coverageLevel}`)} tone={active ? 'brand' : 'neutral'} />
      </View>
      <Text className="mt-4 font-bodyBold text-[26px] text-brand">{formatCurrency(plan.monthlyPrice)}</Text>
      <Text className="font-body text-[13px] uppercase tracking-[1.4px] text-muted">{t('finance.perMonth')}</Text>
      <View className="mt-4 flex-row flex-wrap gap-2">
        {plan.tags.map((tag) => (
          <Badge key={tag} label={t(`finance.planTags.${tag}`)} tone="neutral" />
        ))}
      </View>
      <View className="mt-4 gap-2">
        {plan.pros.map((pro) => (
          <Text key={pro} className="font-body text-[14px] leading-6 text-ink">
            • {t(`finance.planPerks.${pro}`)}
          </Text>
        ))}
      </View>
    </Card>
  );
}
