import { router } from 'expo-router';
import * as Location from 'expo-location';
import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line import/no-unresolved
import { DoctorMap } from '@/components/doctor/DoctorMap';
import { FilterBar } from '@/components/doctor/FilterBar';
import { DoctorCard } from '@/components/doctor/DoctorCard';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fetchHealthdirectOverlay } from '@/lib/api/healthdirect';
import { searchNearbyDoctors } from '@/lib/api/google-places';
import type { DoctorFilters, DoctorRecord } from '@/types/doctor';

const initialFilters: DoctorFilters = {
  gender: 'all',
  specialty: 'all',
  billing: 'all',
};

export default function DoctorScreen() {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [statusText, setStatusText] = useState('');
  const [filters, setFilters] = useState<DoctorFilters>(initialFilters);

  useEffect(() => {
    let active = true;

    async function load() {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (active) {
        setStatusText(permission.granted ? t('doctor.locationReady') : t('doctor.locationFallback'));
      }

      const [nearbyDoctors, overlay] = await Promise.all([searchNearbyDoctors(), fetchHealthdirectOverlay()]);

      if (!active) {
        return;
      }

      setDoctors(
        nearbyDoctors.map((doctor) => ({
          ...doctor,
          bulkBilling: overlay[doctor.id]?.bulkBilling ?? doctor.bulkBilling,
        })),
      );
    }

    void load();

    return () => {
      active = false;
    };
  }, [t]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesGender = filters.gender === 'all' ? true : doctor.gender === filters.gender;
      const matchesSpecialty = filters.specialty === 'all' ? true : doctor.specialties.includes(filters.specialty);
      const matchesBilling =
        filters.billing === 'all' ? true : filters.billing === 'yes' ? doctor.bulkBilling : !doctor.bulkBilling;

      return matchesGender && matchesSpecialty && matchesBilling;
    });
  }, [doctors, filters]);

  return (
    <Screen>
      <SectionHeading title={t('doctor.title')} description={t('doctor.subtitle')} />
      <Card className="gap-3">
        <Text className="font-body text-[14px] leading-6 text-muted">{statusText}</Text>
        <View className="h-[220px] overflow-hidden rounded-[24px]">
          <DoctorMap doctors={filteredDoctors} helperText={t('doctor.mapFallback')} />
        </View>
      </Card>
      <Card>
        <FilterBar value={filters} onChange={setFilters}>
          <FilterBar.Group label={t('doctor.filters.gender')}>
            <FilterBar.Option field="gender" label={t('doctor.filters.all')} value="all" />
            <FilterBar.Option field="gender" label={t('doctor.filters.male')} value="male" />
            <FilterBar.Option field="gender" label={t('doctor.filters.female')} value="female" />
          </FilterBar.Group>
          <FilterBar.Group label={t('doctor.filters.specialty')}>
            <FilterBar.Option field="specialty" label={t('doctor.filters.all')} value="all" />
            <FilterBar.Option field="specialty" label={t('doctor.specialties.anxiety')} value="anxiety" />
            <FilterBar.Option field="specialty" label={t('doctor.specialties.depression')} value="depression" />
            <FilterBar.Option field="specialty" label={t('doctor.specialties.trauma')} value="trauma" />
          </FilterBar.Group>
          <FilterBar.Group label={t('doctor.filters.billing')}>
            <FilterBar.Option field="billing" label={t('doctor.filters.all')} value="all" />
            <FilterBar.Option field="billing" label={t('doctor.filters.yes')} value="yes" />
            <FilterBar.Option field="billing" label={t('doctor.filters.no')} value="no" />
          </FilterBar.Group>
        </FilterBar>
      </Card>
      {filteredDoctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} onPress={() => router.push({ pathname: '/doctor/[id]', params: { id: doctor.id } })} />
      ))}
    </Screen>
  );
}
