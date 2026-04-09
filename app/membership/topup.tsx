import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useUser } from '@/hooks/useUser';

const packs = [
  { id: 'starter', price: '$5', credits: 50 },
  { id: 'plus', price: '$15', credits: 150 },
  { id: 'max', price: '$30', credits: 350 },
];

export default function TopupScreen() {
  const { t } = useTranslation();
  const { actions } = useUser();
  const [selectedId, setSelectedId] = useState(packs[1].id);
  const [success, setSuccess] = useState(false);

  const selectedPack = packs.find((pack) => pack.id === selectedId) ?? packs[1];

  function handleMockPayment() {
    actions.topUpCredits(selectedPack.credits);
    actions.upgradeToPremium();
    setSuccess(true);
  }

  return (
    <Screen>
      <SectionHeading title={t('membership.topupTitle')} description={t('membership.topupBody')} />
      {packs.map((pack) => (
        <Pressable key={pack.id} onPress={() => setSelectedId(pack.id)}>
          <Card className={selectedId === pack.id ? 'border-brand bg-brandSoft' : ''}>
            <View className="flex-row items-center justify-between">
              <Text className="font-display text-[30px] text-ink">{pack.price}</Text>
              <Text className="font-bodyBold text-[16px] text-brand">{pack.credits} {t('common.credits')}</Text>
            </View>
          </Card>
        </Pressable>
      ))}
      <Button label={t('common.continue')} onPress={handleMockPayment} />
      {success ? (
        <Card className="gap-2 bg-brandDeep">
          <Text className="font-display text-[30px] text-white">{t('common.done')}</Text>
          <Text className="font-body text-[15px] leading-6 text-white/85">{t('membership.packSuccess')}</Text>
        </Card>
      ) : null}
    </Screen>
  );
}
