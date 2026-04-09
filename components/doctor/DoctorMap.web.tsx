import { Text, View } from 'react-native';

type DoctorMapProps = {
  helperText: string;
};

export function DoctorMap({ helperText }: DoctorMapProps) {
  return (
    <View className="rounded-[24px] bg-[#f5ece8] p-5">
      <Text className="font-body text-[15px] leading-6 text-muted">{helperText}</Text>
    </View>
  );
}
