import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDistance } from '@/lib/utils/format';
import type { DoctorRecord } from '@/types/doctor';

type DoctorCardProps = {
  doctor: DoctorRecord;
  onPress: () => void;
};

export function DoctorCard({ doctor, onPress }: DoctorCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress}>
      <Card className="gap-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text className="font-display text-[28px] leading-[30px] text-ink">{doctor.name}</Text>
            <Text className="font-body text-[14px] text-muted">{doctor.title}</Text>
          </View>
          <Badge label={doctor.bulkBilling ? t('doctor.bulkBilling') : t('doctor.privateBilling')} tone={doctor.bulkBilling ? 'success' : 'warning'} />
        </View>
        <Text className="font-body text-[14px] leading-6 text-ink">{doctor.bio}</Text>
        <View className="flex-row flex-wrap gap-2">
          {doctor.specialties.map((specialty) => (
            <Badge key={specialty} label={t(`doctor.specialties.${specialty}`)} tone="neutral" />
          ))}
        </View>
        <View className="flex-row justify-between">
          <Text className="font-body text-[13px] text-muted">{formatDistance(doctor.distanceKm)}</Text>
          <Text className="font-body text-[13px] text-muted">★ {doctor.rating.toFixed(1)} · {doctor.reviewCount}</Text>
        </View>
      </Card>
    </Pressable>
  );
}
