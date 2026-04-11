import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useUser } from '@/hooks/useUser';
import type { AppLanguage } from '@/types/user';

const languageOptions: { value: AppLanguage; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'zh', label: '中文' },
  { value: 'ne', label: 'नेपाली' },
  { value: 'es', label: 'ES' },
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, bookings, actions } = useUser();

  return (
    <Screen>
      <SectionHeading title={t('profile.title')} description={t('profile.connectedHint')} />
      <Card className="gap-3">
        <Badge label={t('profile.demoMode')} tone="neutral" />
        <Text className="font-display text-[36px] text-ink">{user?.name}</Text>
        <Text className="font-body text-[15px] text-muted">{user?.email}</Text>
        <View className="flex-row gap-3">
          <Badge label={user?.membership === 'premium' ? t('common.premium') : t('common.free')} tone="brand" />
          <Badge label={`${user?.credits ?? 0} ${t('common.credits')}`} tone="success" />
        </View>
      </Card>
      <Card className="gap-3">
        <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('profile.languageTitle')}</Text>
        <View className="flex-row flex-wrap gap-2">
          {languageOptions.map((option) => (
            <Pressable
              key={option.value}
              className={`rounded-full px-4 py-2 ${user?.language === option.value ? 'bg-brand' : 'bg-[#f4ece8]'}`}
              onPress={() => actions.changeLanguage(option.value)}
            >
              <Text className={`font-bodyBold text-[13px] ${user?.language === option.value ? 'text-white' : 'text-ink'}`}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
      <Pressable onPress={() => router.push('/membership/plans')}>
        <Card className="gap-2">
          <Text className="font-display text-[28px] text-ink">{t('membership.plansTitle')}</Text>
          <Text className="font-body text-[15px] leading-6 text-muted">{t('membership.subtitle')}</Text>
        </Card>
      </Pressable>
      <Pressable onPress={() => router.push('/membership/referral')}>
        <Card className="gap-2">
          <Text className="font-display text-[28px] text-ink">{t('membership.referralTitle')}</Text>
          <Text className="font-body text-[15px] leading-6 text-muted">{user?.referralCode}</Text>
        </Card>
      </Pressable>
      <Card className="gap-3">
        <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('profile.bookingsTitle')}</Text>
        {bookings.length ? (
          bookings.slice(0, 3).map((booking) => (
            <Text key={booking.id} className="font-body text-[15px] leading-6 text-ink">{booking.doctorName} · {booking.date} · {booking.slot}</Text>
          ))
        ) : (
          <Text className="font-body text-[15px] leading-6 text-muted">{t('profile.noBookings')}</Text>
        )}
      </Card>
      <Button label={t('common.signOut')} onPress={actions.signOut} variant="outline" />
    </Screen>
  );
}
