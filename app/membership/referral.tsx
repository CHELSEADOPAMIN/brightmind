import * as Clipboard from 'expo-clipboard';
import { Share, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useUser } from '@/hooks/useUser';

export default function ReferralScreen() {
  const { t } = useTranslation();
  const { user, referrals } = useUser();
  const referralCode = user?.referralCode?.trim() ?? '';

  async function copyCode() {
    if (!referralCode) {
      return;
    }

    await Clipboard.setStringAsync(referralCode);
  }

  async function shareCode() {
    if (!referralCode) {
      return;
    }

    await Share.share({
      title: t('membership.referralTitle'),
      message: `BrightMind · ${t('profile.referralTitle')}: ${referralCode}`,
    });
  }

  return (
    <Screen>
      <SectionHeading title={t('membership.referralTitle')} description={t('membership.referralBody')} />
      <Card className="gap-3">
        <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('profile.referralTitle')}</Text>
        <Text className="font-display text-[36px] text-brand">{referralCode}</Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button label={t('common.copy')} onPress={copyCode} variant="outline" disabled={!referralCode} />
          </View>
          <View className="flex-1">
            <Button label={t('common.share')} onPress={shareCode} disabled={!referralCode} />
          </View>
        </View>
      </Card>
      {referrals.map((referral) => (
        <Card key={referral.id} className="gap-1">
          <Text className="font-display text-[28px] text-ink">{referral.name}</Text>
          <Text className="font-body text-[14px] text-muted">+{referral.creditsGiven} {t('common.credits')}</Text>
        </Card>
      ))}
    </Screen>
  );
}
