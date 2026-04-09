import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { doctorSeed } from '@/data/doctors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useUser } from '@/hooks/useUser';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function DoctorBookScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ doctorId: string }>();
  const { actions } = useUser();
  const doctor = useMemo(() => doctorSeed.find((item) => item.id === params.doctorId) ?? doctorSeed[0], [params.doctorId]);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedSlot, setSelectedSlot] = useState(doctor.availability[0]);
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  function submitBooking() {
    actions.addBooking({
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: selectedDay,
      slot: selectedSlot,
      note,
    });
    setConfirmed(true);
  }

  return (
    <Screen>
      <SectionHeading title={t('doctor.bookTitle')} description={t('doctor.bookSubtitle')} />
      {confirmed ? (
        <Card className="gap-3 bg-brandDeep">
          <Text className="font-display text-[34px] text-white">{t('doctor.bookingConfirmed')}</Text>
          <Text className="font-body text-[15px] leading-6 text-white/85">{t('doctor.bookingBody')}</Text>
          <Text className="font-bodyBold text-[15px] text-white">{doctor.name} · {selectedDay} · {selectedSlot}</Text>
        </Card>
      ) : (
        <Card className="gap-4">
          <Text className="font-display text-[28px] text-ink">{doctor.name}</Text>
          <View className="gap-2">
            <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('doctor.dateLabel')}</Text>
            <View className="flex-row flex-wrap gap-2">
              {days.map((day) => (
                <Pressable key={day} className={`rounded-full px-4 py-2 ${selectedDay === day ? 'bg-brand' : 'bg-[#f4ece8]'}`} onPress={() => setSelectedDay(day)}>
                  <Text className={`font-bodyBold text-[13px] ${selectedDay === day ? 'text-white' : 'text-ink'}`}>{day}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View className="gap-2">
            <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('doctor.slotLabel')}</Text>
            <View className="flex-row flex-wrap gap-2">
              {doctor.availability.map((slot) => (
                <Pressable key={slot} className={`rounded-full px-4 py-2 ${selectedSlot === slot ? 'bg-brand' : 'bg-[#f4ece8]'}`} onPress={() => setSelectedSlot(slot)}>
                  <Text className={`font-bodyBold text-[13px] ${selectedSlot === slot ? 'text-white' : 'text-ink'}`}>{slot}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View className="gap-2">
            <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('doctor.noteLabel')}</Text>
            <TextInput
              className="min-h-[110px] rounded-[20px] border border-stroke bg-white p-4 font-body text-[15px] text-ink"
              multiline
              onChangeText={setNote}
              placeholderTextColor="#8b7d78"
              value={note}
            />
          </View>
          <Button label={t('common.book')} onPress={submitBooking} />
        </Card>
      )}
    </Screen>
  );
}
