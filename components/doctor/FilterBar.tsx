import { createContext, useContext, type PropsWithChildren } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { DoctorFilters } from '@/types/doctor';

type FiltersShape = DoctorFilters;

type FilterBarProps = PropsWithChildren<{
  value: FiltersShape;
  onChange: (nextValue: FiltersShape) => void;
}>;

type FilterContextValue = {
  value: FiltersShape;
  onChange: (field: keyof FiltersShape, value: string) => void;
};

const FilterContext = createContext<FilterContextValue | null>(null);

function Root({ children, value, onChange }: FilterBarProps) {
  return (
    <FilterContext.Provider
      value={{
        value,
        onChange: (field, nextValue) => onChange({ ...value, [field]: nextValue }),
      }}
    >
      <View className="gap-4">{children}</View>
    </FilterContext.Provider>
  );
}

function Group({ label, children }: PropsWithChildren<{ label: string }>) {
  return (
    <View className="gap-2">
      <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{label}</Text>
      <View className="flex-row flex-wrap gap-2">{children}</View>
    </View>
  );
}

function Option({ field, value, label }: { field: keyof FiltersShape; value: FiltersShape[keyof FiltersShape]; label: string }) {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error('FilterBar.Option must be used inside FilterBar');
  }

  const active = context.value[field] === value;

  return (
    <Pressable
      accessibilityRole="button"
      className={`rounded-full px-4 py-2 ${active ? 'bg-brand' : 'bg-[#f5ece8]'}`}
      onPress={() => context.onChange(field, value)}
    >
      <Text className={`font-bodyBold text-[13px] ${active ? 'text-white' : 'text-ink'}`}>{label}</Text>
    </Pressable>
  );
}

export const FilterBar = Object.assign(Root, {
  Group,
  Option,
});
