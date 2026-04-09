import { Pressable, Text, type PressableProps } from 'react-native';

const variants = {
  primary: 'bg-brand',
  secondary: 'bg-brandSoft',
  outline: 'border border-stroke bg-white',
  ghost: 'bg-transparent',
} as const;

const textVariants = {
  primary: 'text-white',
  secondary: 'text-brand',
  outline: 'text-ink',
  ghost: 'text-brand',
} as const;

type ButtonProps = PressableProps & {
  label: string;
  variant?: keyof typeof variants;
};

export function Button({ label, variant = 'primary', disabled, ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-[52px] items-center justify-center rounded-[20px] px-5 ${variants[variant]} ${disabled ? 'opacity-50' : ''}`}
      disabled={disabled}
      {...props}
    >
      <Text className={`font-bodyBold text-[15px] ${textVariants[variant]}`}>{label}</Text>
    </Pressable>
  );
}
