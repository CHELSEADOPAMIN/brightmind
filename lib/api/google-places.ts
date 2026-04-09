import { doctorSeed } from '@/data/doctors';
import type { DoctorRecord } from '@/types/doctor';

export async function searchNearbyDoctors(): Promise<DoctorRecord[]> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return Promise.resolve(doctorSeed);
  }

  return Promise.resolve(doctorSeed);
}
