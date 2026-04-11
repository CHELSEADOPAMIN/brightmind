import { useMemo, useState } from 'react';
import { Image, Text, View } from 'react-native';

import type { DoctorRecord } from '@/types/doctor';

type DoctorMapProps = {
  doctors: DoctorRecord[];
  helperText: string;
};

const defaultCenter = {
  latitude: -33.8688,
  longitude: 151.2093,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createStaticMapUrl(doctors: DoctorRecord[]) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return null;
  }

  const center =
    doctors.length > 0
      ? {
          latitude: doctors.reduce((sum, doctor) => sum + doctor.latitude, 0) / doctors.length,
          longitude: doctors.reduce((sum, doctor) => sum + doctor.longitude, 0) / doctors.length,
        }
      : defaultCenter;

  const params = new URLSearchParams({
    center: `${center.latitude},${center.longitude}`,
    zoom: '13',
    size: '1200x640',
    scale: '2',
    maptype: 'roadmap',
    key: apiKey,
    style: 'feature:poi|visibility:off',
  });

  doctors.slice(0, 5).forEach((doctor, index) => {
    params.append(
      'markers',
      `color:0xdf3f35|label:${String.fromCharCode(65 + index)}|${doctor.latitude},${doctor.longitude}`,
    );
  });

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

function buildPreviewPoints(doctors: DoctorRecord[]) {
  const latitudes = doctors.map((doctor) => doctor.latitude);
  const longitudes = doctors.map((doctor) => doctor.longitude);

  const minLatitude = latitudes.length ? Math.min(...latitudes) - 0.01 : defaultCenter.latitude - 0.02;
  const maxLatitude = latitudes.length ? Math.max(...latitudes) + 0.01 : defaultCenter.latitude + 0.02;
  const minLongitude = longitudes.length ? Math.min(...longitudes) - 0.015 : defaultCenter.longitude - 0.025;
  const maxLongitude = longitudes.length ? Math.max(...longitudes) + 0.015 : defaultCenter.longitude + 0.025;

  return doctors.map((doctor) => {
    const x = (doctor.longitude - minLongitude) / (maxLongitude - minLongitude || 1);
    const y = 1 - (doctor.latitude - minLatitude) / (maxLatitude - minLatitude || 1);

    return {
      id: doctor.id,
      label: doctor.name.replace('Dr ', '').split(' ')[0],
      left: `${clamp(x, 0.08, 0.92) * 100}%` as `${number}%`,
      top: `${clamp(y, 0.12, 0.88) * 100}%` as `${number}%`,
    };
  });
}

export function DoctorMap({ doctors, helperText }: DoctorMapProps) {
  const [staticMapFailed, setStaticMapFailed] = useState(false);
  const staticMapUrl = useMemo(() => createStaticMapUrl(doctors), [doctors]);
  const previewPoints = useMemo(() => buildPreviewPoints(doctors), [doctors]);
  const shouldUseStaticMap = Boolean(staticMapUrl && !staticMapFailed);

  return (
    <View className="relative h-full w-full overflow-hidden rounded-[24px] border border-stroke bg-[#f5ece8]">
      {shouldUseStaticMap && staticMapUrl ? (
        <Image className="h-full w-full" onError={() => setStaticMapFailed(true)} resizeMode="cover" source={{ uri: staticMapUrl }} />
      ) : (
        <>
          <View className="absolute inset-0 bg-[#f4e6de]" />
          <View className="absolute left-[8%] top-[14%] h-[180px] w-[180px] rounded-full bg-[#efd7ca] opacity-80" />
          <View className="absolute right-[-4%] top-[12%] h-[150px] w-[150px] rounded-full bg-[#f7d9c7] opacity-60" />
          <View className="absolute bottom-[-10%] left-[26%] h-[160px] w-[220px] rounded-full bg-[#ead0c4] opacity-70" />
          <View className="absolute left-[10%] top-[24%] h-[10px] w-[74%] -rotate-[7deg] rounded-full bg-white/50" />
          <View className="absolute left-[16%] top-[46%] h-[9px] w-[60%] rotate-[11deg] rounded-full bg-white/45" />
          <View className="absolute left-[20%] top-[67%] h-[8px] w-[52%] -rotate-[8deg] rounded-full bg-white/40" />

          {previewPoints.map((point) => (
            <View
              key={point.id}
              className="absolute -ml-3 -mt-3 items-center"
              style={{
                left: point.left,
                top: point.top,
              }}
            >
              <View className="h-4 w-4 rounded-full border-2 border-white bg-brand shadow-sm" />
              <View className="mt-1 rounded-full bg-white/92 px-2 py-1">
                <Text className="font-bodyBold text-[11px] text-ink">{point.label}</Text>
              </View>
            </View>
          ))}
        </>
      )}

      <View className="absolute inset-x-3 bottom-3 rounded-[18px] border border-white/60 bg-white/88 px-3 py-2">
        <Text className="font-body text-[12px] leading-5 text-muted">{helperText}</Text>
      </View>
    </View>
  );
}
