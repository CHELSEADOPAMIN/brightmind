import { View, type ViewProps } from 'react-native';

export function Card({ className = '', ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={`rounded-[28px] border border-stroke bg-surface p-5 shadow-card ${className}`}
      {...props}
    />
  );
}
