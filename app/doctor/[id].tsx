import { router, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { doctorSeed } from '@/data/doctors';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';

export default function DoctorDetailScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const doctor = doctorSeed.find((item) => item.id === params.id);

  if (!doctor) {
    return (
      <Screen>
        <SectionHeading title={t('notFound.title')} description={t('notFound.body')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeading title={doctor.name} description={doctor.title} />
      <Card className="gap-3">
        <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('doctor.about')}</Text>
        <Text className="font-body text-[15px] leading-6 text-ink">{doctor.bio}</Text>
        <View className="flex-row flex-wrap gap-2">
          {doctor.specialties.map((specialty) => (
            <Badge key={specialty} label={t(`doctor.specialties.${specialty}`)} tone="neutral" />
          ))}
        </View>
      </Card>
      <Card className="gap-3">
        <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('doctor.languages')}</Text>
        <Text className="font-body text-[15px] text-ink">{doctor.languages.join(' · ')}</Text>
        <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('doctor.suburb')}</Text>
        <Text className="font-body text-[15px] text-ink">{doctor.suburb}</Text>
        <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('doctor.availability')}</Text>
        {doctor.availability.map((slot) => (
          <Text key={slot} className="font-body text-[15px] text-ink">{slot}</Text>
        ))}
      </Card>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button label={t('common.call')} onPress={() => Linking.openURL(`tel:${doctor.phone}`)} variant="outline" />
        </View>
        <View className="flex-1">
          <Button label={t('common.book')} onPress={() => router.push({ pathname: '/doctor/book', params: { doctorId: doctor.id } })} />
        </View>
      </View>
    </Screen>
  );
}
