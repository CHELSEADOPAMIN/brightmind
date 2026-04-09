import MapView, { Marker } from 'react-native-maps';

import type { DoctorRecord } from '@/types/doctor';

type DoctorMapProps = {
  doctors: DoctorRecord[];
  helperText?: string;
};

export function DoctorMap({ doctors }: DoctorMapProps) {
  return (
    <MapView
      className="h-full w-full"
      initialRegion={{
        latitude: -37.8136,
        longitude: 144.9631,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }}
    >
      {doctors.map((doctor) => (
        <Marker
          key={doctor.id}
          coordinate={{ latitude: doctor.latitude, longitude: doctor.longitude }}
          title={doctor.name}
        />
      ))}
    </MapView>
  );
}
