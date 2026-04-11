import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useUser } from '@/hooks/useUser';

const plans = [
  { id: 'monthly', price: '$1.99', credits: 50, durationKey: 'monthly' as const },
  { id: 'quarterly', price: '$5.97', credits: 150, durationKey: 'quarterly' as const },
  { id: 'semi-annual', price: '$11.94', credits: 350, durationKey: 'semiAnnual' as const },
];

export default function TopupScreen() {
  const { t } = useTranslation();
  const { actions } = useUser();
  const [selectedId, setSelectedId] = useState(plans[0].id);
  const [success, setSuccess] = useState(false);

  const selectedPlan = plans.find((plan) => plan.id === selectedId) ?? plans[0];

  function handlePurchase() {
    actions.topUpCredits(selectedPlan.credits);
    actions.upgradeToPremium();
    setSuccess(true);
  }

  return (
    <Screen>
      <SectionHeading title={t('membership.topupTitle')} description={t('membership.topupBody')} />
      {plans.map((plan) => (
        <Pressable key={plan.id} onPress={() => setSelectedId(plan.id)}>
          <Card className={selectedId === plan.id ? 'border-brand bg-brandSoft' : ''}>
            <View className="flex-row items-center justify-between">
              <View className="gap-1">
                <Text className="font-display text-[30px] text-ink">{plan.price}</Text>
                <Text className="font-body text-[13px] text-muted">{t('membership.premiumPurchaseHint')}</Text>
              </View>
              <View className="items-end gap-1">
                <Text className="font-bodyBold text-[16px] text-brand">{t(`membership.planDurations.${plan.durationKey}`)}</Text>
                <Text className="font-body text-[12px] text-muted">{t('common.premium')}</Text>
              </View>
            </View>
          </Card>
        </Pressable>
      ))}
      <Button label={t('common.continue')} onPress={handlePurchase} />
      {success ? (
        <Card className="gap-2 border border-brand bg-brandSoft">
          <Text className="font-display text-[30px] text-ink">{t('common.done')}</Text>
          <Text className="font-body text-[15px] leading-6 text-ink">{t('membership.packSuccess')}</Text>
        </Card>
      ) : null}
    </Screen>
  );
}
