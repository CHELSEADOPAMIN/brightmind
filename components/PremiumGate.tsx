import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useUser } from '@/hooks/useUser';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type PremiumGateProps = {
  children: ReactNode;
  onUpgrade?: () => void;
  previewTitle?: string;
  previewDescription?: string;
};

export function PremiumGate({ children, onUpgrade, previewTitle, previewDescription }: PremiumGateProps) {
  const { t } = useTranslation();
  const { isPremium } = useUser();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <Card className="gap-4 border-brand bg-brandSoft">
      <Badge label={t('common.premium')} tone="brand" />
      {previewTitle ? (
        <View className="gap-2 rounded-[24px] border border-brand bg-white px-4 py-4">
          <Text className="font-display text-[28px] text-ink">{previewTitle}</Text>
          {previewDescription ? <Text className="font-body text-[15px] leading-6 text-muted">{previewDescription}</Text> : null}
        </View>
      ) : null}
      <View className="gap-2">
        <Text className="font-display text-[30px] text-ink">{t('membership.lockedTitle')}</Text>
        <Text className="font-body text-[15px] leading-6 text-muted">{t('membership.lockedBody')}</Text>
      </View>
      <Button label={t('common.upgrade')} onPress={onUpgrade} />
    </Card>
  );
}
