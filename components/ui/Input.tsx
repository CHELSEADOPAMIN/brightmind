import { Text, TextInput, View, type TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  label: string;
};

export function Input({ label, className = '', ...props }: InputProps & { className?: string }) {
  return (
    <View className="gap-2">
      <Text className="font-body text-[13px] uppercase tracking-[1.6px] text-muted">{label}</Text>
      <TextInput
        className={`min-h-[52px] rounded-[18px] border border-stroke bg-white px-4 font-body text-[15px] text-ink ${className}`}
        placeholderTextColor="#8b7d78"
        {...props}
      />
    </View>
  );
}
