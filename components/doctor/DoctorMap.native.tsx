import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import type { DoctorRecord } from '@/types/doctor';

type DoctorMapProps = {
  doctors: DoctorRecord[];
  helperText?: string;
};

export function DoctorMap({ doctors }: DoctorMapProps) {
  return (
    <MapView
      loadingEnabled
      initialRegion={{
        latitude: -33.8688,
        longitude: 151.2093,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }}
      style={styles.map}
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

const styles = StyleSheet.create({
  map: StyleSheet.absoluteFillObject,
});
