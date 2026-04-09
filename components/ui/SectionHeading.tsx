import { Text, View } from 'react-native';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  titleClassName?: string;
  titleNumberOfLines?: number;
  titleAdjustsFontSizeToFit?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  titleClassName = '',
  titleNumberOfLines,
  titleAdjustsFontSizeToFit = false,
}: SectionHeadingProps) {
  return (
    <View className="gap-1">
      {eyebrow ? <Text className="font-body text-[12px] uppercase tracking-[2px] text-brand">{eyebrow}</Text> : null}
      <Text
        adjustsFontSizeToFit={titleAdjustsFontSizeToFit}
        className={`font-display text-[32px] leading-[36px] text-ink ${titleClassName}`}
        numberOfLines={titleNumberOfLines}
      >
        {title}
      </Text>
      {description ? <Text className="font-body text-[15px] leading-6 text-muted">{description}</Text> : null}
    </View>
  );
}
