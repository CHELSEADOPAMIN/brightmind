import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/Card';
import type { OshcPlan } from '@/types/oshc';

type CompareTableProps = {
  plans: OshcPlan[];
};

const rows = ['monthlyPrice', 'mentalHealth', 'dental', 'optical', 'telehealth'] as const;

export function CompareTable({ plans }: CompareTableProps) {
  const { t } = useTranslation();

  if (!plans.length) {
    return null;
  }

  return (
    <Card className="gap-4">
      <Text className="font-display text-[28px] text-ink">{t('finance.compareMatrix')}</Text>
      <View className="rounded-[20px] border border-stroke">
        <View className="flex-row border-b border-stroke bg-[#fcf8f5]">
          <View className="w-[110px] justify-center bg-[#f7efeb] px-3 py-4">
            <Text className="font-bodyBold text-[13px] text-ink">{t('finance.compareColumns.provider')}</Text>
          </View>
          {plans.map((plan, columnIndex) => (
            <View
              key={`${plan.id}-header`}
              className={`flex-1 justify-center px-3 py-4 ${columnIndex < plans.length - 1 ? 'border-r border-stroke' : ''}`}
            >
              <Text className="font-bodyBold text-[13px] leading-5 text-ink">{plan.provider}</Text>
            </View>
          ))}
        </View>
        {rows.map((row, rowIndex) => (
          <View key={row} className={`flex-row ${rowIndex < rows.length - 1 ? 'border-b border-stroke' : ''}`}>
            <View className="w-[110px] bg-[#f7efeb] px-3 py-4">
              <Text className="font-bodyBold text-[13px] text-ink">{t(`finance.compareRows.${row}`)}</Text>
            </View>
            {plans.map((plan, columnIndex) => (
              <View
                key={`${plan.id}-${row}`}
                className={`flex-1 px-3 py-4 ${columnIndex < plans.length - 1 ? 'border-r border-stroke' : ''}`}
              >
                <Text className="font-body text-[13px] leading-5 text-muted">
                  {row === 'monthlyPrice'
                    ? `$${plan.monthlyPrice}`
                    : plan.extras.includes(row) || plan.tags.includes(row)
                      ? t('common.yes')
                      : t('common.no')}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </Card>
  );
}
