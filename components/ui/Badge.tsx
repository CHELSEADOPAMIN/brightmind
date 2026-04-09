import { Text, View } from 'react-native';

const tones = {
  brand: 'bg-brandSoft text-brand',
  neutral: 'bg-[#f4ece8] text-muted',
  success: 'bg-[#e7f6ef] text-success',
  warning: 'bg-[#fff3de] text-warning',
} as const;

type BadgeProps = {
  label: string;
  tone?: keyof typeof tones;
};

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return (
    <View className="self-start rounded-full px-3 py-1.5">
      <Text className={`font-bodyBold text-[12px] ${tones[tone]}`}>{label}</Text>
    </View>
  );
}
