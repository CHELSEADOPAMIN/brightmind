import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/Card';
import { useTranslationService } from '@/providers/translation-provider';

const languageOptions = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'ne', label: 'नेपाली' },
  { value: 'es', label: 'Español' },
];

type LanguageSelectorProps = {
  activeLanguage: string;
  onSelect: (language: string) => void;
};

function LanguageSelector({ activeLanguage, onSelect }: LanguageSelectorProps) {
  return (
    <View className="flex-row gap-2">
      {languageOptions.map((language) => {
        const isActive = activeLanguage === language.value;

        return (
          <Pressable
            key={language.value}
            className={`min-w-0 flex-1 items-center rounded-[18px] border px-2 py-2.5 ${
              isActive ? 'border-brand bg-brand' : 'border-[#ead9d2] bg-[#f4ece8]'
            }`}
            onPress={() => onSelect(language.value)}
          >
            <Text
              className={`font-bodyBold text-[12px] ${isActive ? 'text-white' : 'text-ink'}`}
              numberOfLines={1}
            >
              {language.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function TextTranslator() {
  const { t } = useTranslation();
  const { state, actions, meta } = useTranslationService();
  const runTranslationRef = useRef(actions.runTranslation);
  const clearOutputRef = useRef(actions.clearOutput);

  useEffect(() => {
    runTranslationRef.current = actions.runTranslation;
    clearOutputRef.current = actions.clearOutput;
  }, [actions.clearOutput, actions.runTranslation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!state.sourceText.trim()) {
        clearOutputRef.current();
        return;
      }

      void runTranslationRef.current();
    }, 350);

    return () => clearTimeout(timer);
  }, [state.sourceLanguage, state.sourceText, state.targetLanguage]);

  return (
    <Card className="gap-4">
      <Text className="font-display text-[28px] text-ink">{t('translate.textTitle')}</Text>
      <LanguageSelector activeLanguage={state.sourceLanguage} onSelect={actions.setSourceLanguage} />
      <TextInput
        className="min-h-[140px] rounded-[24px] border border-stroke bg-white p-4 font-body text-[15px] leading-6 text-ink"
        multiline
        onChangeText={actions.setSourceText}
        placeholder={t('translate.inputPlaceholder')}
        placeholderTextColor="#8b7d78"
        textAlignVertical="top"
        value={state.sourceText}
      />
      <View className="flex-row items-center justify-between">
        <Text className="font-body text-[13px] uppercase tracking-[1.6px] text-muted">{t('translate.targetLanguage')}</Text>
        <Pressable onPress={actions.swapLanguages}>
          <Text className="font-bodyBold text-[13px] text-brand">{t('translate.swap')}</Text>
        </Pressable>
      </View>
      <LanguageSelector activeLanguage={state.targetLanguage} onSelect={actions.setTargetLanguage} />
      <View className={`min-h-[140px] rounded-[24px] p-4 ${meta.errorCode ? 'bg-[#fff1ee]' : 'bg-[#f8efeb]'}`}>
        <Text className={`font-body text-[15px] leading-6 ${meta.errorCode ? 'text-[#b84c3a]' : 'text-ink'}`}>
          {meta.isTranslating
            ? t('translate.translating')
            : meta.errorCode
              ? t(`translate.errors.${meta.errorCode}`)
              : state.translatedText || t('translate.outputPlaceholder')}
        </Text>
      </View>
      {state.history.length ? (
        <View className="gap-2">
          <Text className="font-body text-[12px] uppercase tracking-[1.6px] text-muted">{t('translate.history')}</Text>
          {state.history.slice(0, 3).map((record) => (
            <View key={record.id} className="rounded-[20px] bg-[#f4ece8] p-3">
              <View className="flex-row items-start justify-between gap-3">
                <View className="min-w-0 flex-1">
                  <Text className="font-body text-[13px] text-muted">{record.sourceText}</Text>
                  <Text className="mt-1 font-bodyBold text-[14px] text-ink">{record.translatedText}</Text>
                </View>
                <Pressable
                  accessibilityLabel={t('translate.deleteHistoryItem')}
                  className="rounded-full border border-[#dec9c0] bg-[#fff8f4] p-2"
                  hitSlop={8}
                  onPress={() => actions.removeHistoryRecord(record.id)}
                >
                  <MaterialIcons color="#8b7d78" name="close" size={16} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}
