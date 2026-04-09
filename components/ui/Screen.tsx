import type { ReactNode } from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = ScrollViewProps & {
  children: ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = true, contentContainerStyle, ...props }: ScreenProps) {
  if (!scroll) {
    return (
      <SafeAreaView className="flex-1 bg-paper">
        <View className="flex-1 bg-paper px-5 pb-6 pt-2">{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <ScrollView
        className="flex-1 bg-paper"
        contentContainerStyle={[{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32, gap: 16 }, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
