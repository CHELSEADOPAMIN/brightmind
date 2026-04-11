import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { voiceScripts } from '@/data/voice-scripts';
import { PremiumGate } from '@/components/PremiumGate';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useUser } from '@/hooks/useUser';

const waveformSeeds = [12, 24, 16, 30, 20, 26, 14];
const languageLabels = {
  zh: '中文',
  en: 'English',
  ne: 'नेपाली',
  es: 'Español',
} as const;

function tokenizeForStreaming(text: string) {
  const wordTokens = text.match(/\S+\s*/g);

  if (wordTokens && wordTokens.length > 1) {
    return wordTokens;
  }

  return Array.from(text);
}

export default function VoiceTranslateScreen() {
  const { t } = useTranslation();
  const { isPremium } = useUser();
  const [activeId, setActiveId] = useState<(typeof voiceScripts)[number]['id']>(voiceScripts[0].id);
  const [phase, setPhase] = useState<'idle' | 'listening' | 'processing' | 'done'>('idle');
  const [recognized, setRecognized] = useState('');
  const [translated, setTranslated] = useState('');
  const [signalTick, setSignalTick] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeScript = useMemo(() => voiceScripts.find((item) => item.id === activeId) ?? voiceScripts[0], [activeId]);
  const statusText =
    phase === 'listening'
      ? t('translate.listening')
      : phase === 'processing'
        ? t('translate.translating')
        : phase === 'done'
          ? t('translate.translatedResult')
          : t('translate.startListening');

  function clearDemoTimers() {
    timeoutRef.current.forEach((timer) => clearTimeout(timer));
    timeoutRef.current = [];

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function queueTimeout(callback: () => void, delay: number) {
    const timer = setTimeout(callback, delay);
    timeoutRef.current.push(timer);
  }

  function streamText({
    text,
    startDelay,
    stepDelay,
    onChunk,
  }: {
    text: string;
    startDelay: number;
    stepDelay: number;
    onChunk: (next: string) => void;
  }) {
    const tokens = tokenizeForStreaming(text);
    let built = '';

    tokens.forEach((token, index) => {
      queueTimeout(() => {
        built += token;
        onChunk(built);
      }, startDelay + index * stepDelay);
    });

    return startDelay + tokens.length * stepDelay;
  }

  function getWaveHeight(seed: number, index: number) {
    if (phase === 'idle') {
      return Math.max(10, seed - 4);
    }

    if (phase === 'done') {
      return 12;
    }

    const oscillation = ((signalTick + index * 2) % 4) * 6;
    return seed + oscillation;
  }

  function runDemo() {
    clearDemoTimers();
    setPhase('listening');
    setRecognized('');
    setTranslated('');
    setSignalTick(0);
    intervalRef.current = setInterval(() => {
      setSignalTick((current) => current + 1);
    }, 220);

    const recognizedEndAt = streamText({
      text: activeScript.input,
      startDelay: 320,
      stepDelay: activeScript.input.includes(' ') ? 150 : 120,
      onChunk: setRecognized,
    });

    queueTimeout(() => {
      setPhase('processing');
    }, recognizedEndAt + 180);

    const translatedEndAt = streamText({
      text: activeScript.output,
      startDelay: recognizedEndAt + 780,
      stepDelay: activeScript.output.includes(' ') ? 120 : 100,
      onChunk: setTranslated,
    });

    queueTimeout(() => {
      setPhase('done');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, translatedEndAt + 180);
  }

  useEffect(() => {
    return () => {
      clearDemoTimers();
    };
  }, []);

  useEffect(() => {
    clearDemoTimers();
    setPhase('idle');
    setRecognized('');
    setTranslated('');
    setSignalTick(0);
  }, [activeId]);

  if (!isPremium) {
    return (
      <Screen>
        <SectionHeading title={t('translate.voiceTitle')} description={t('translate.voiceSubtitle')} />
        <PremiumGate
          onUpgrade={() => router.push('/membership/plans')}
          previewDescription={t('translate.voiceSubtitle')}
          previewTitle={t('translate.voiceTitle')}
        >
          <View />
        </PremiumGate>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeading title={t('translate.voiceTitle')} description={t('translate.voiceSubtitle')} />
      <Card className="gap-4">
        <View className="flex-row items-center justify-between rounded-[22px] border border-stroke bg-[#fff8f4] px-4 py-3">
          <View className="gap-1">
            <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">Demo script</Text>
            <Text className="font-bodyBold text-[15px] text-ink">{activeScript.sourceLanguage.toUpperCase()} → {activeScript.targetLanguage.toUpperCase()}</Text>
          </View>
          <View className="rounded-full bg-white px-3 py-1.5">
            <Text className="font-bodyBold text-[13px] text-brand">
              {languageLabels[activeScript.sourceLanguage]} → {languageLabels[activeScript.targetLanguage]}
            </Text>
          </View>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {voiceScripts.map((script) => {
            const active = script.id === activeId;
            return (
              <Pressable
                key={script.id}
                className={`rounded-full px-4 py-2 ${active ? 'bg-brand' : 'bg-[#f4ece8]'}`}
                onPress={() => setActiveId(script.id)}
              >
                <Text className={`font-bodyBold text-[13px] ${active ? 'text-white' : 'text-ink'}`}>{script.id.toUpperCase()}</Text>
              </Pressable>
            );
          })}
        </View>
        <View
          className={`items-center justify-center rounded-[30px] border px-6 py-10 ${
            phase === 'listening'
              ? 'border-brand bg-brandSoft'
              : phase === 'processing'
                ? 'border-[#eadbd4] bg-[#f5ece8]'
                : 'border-stroke bg-[#f9efea]'
          }`}
        >
          <View
            className={`h-20 w-20 items-center justify-center rounded-full ${
              phase === 'listening' ? 'bg-brand' : phase === 'processing' ? 'bg-[#e7d7cf]' : 'bg-white'
            }`}
          >
            <MaterialIcons color={phase === 'listening' ? '#ffffff' : '#df3f35'} name="keyboard-voice" size={34} />
          </View>
          <View className="mt-6 flex-row items-end justify-center gap-1">
            {waveformSeeds.map((seed, index) => (
              <View
                key={`${seed}-${index}`}
                className={`w-2 rounded-full ${phase === 'listening' ? 'bg-brand' : phase === 'processing' ? 'bg-[#b87d63]' : 'bg-[#d9b8aa]'}`}
                style={{ height: getWaveHeight(seed, index) }}
              />
            ))}
          </View>
          <Text className="mt-4 font-body text-[14px] uppercase tracking-[2px] text-muted">
            {statusText}
          </Text>
          <Text className="mt-2 font-body text-[13px] leading-5 text-muted">Local staged demo for stable pitching, with streaming transcript timing.</Text>
        </View>
        <Button disabled={phase === 'listening' || phase === 'processing'} label={t('translate.startListening')} onPress={runDemo} />
      </Card>
      <Card className={`gap-2 ${recognized ? 'border-brand bg-[#fff9f6]' : ''}`}>
        <View className="flex-row items-center justify-between">
          <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('translate.recognized')}</Text>
          <Text className="font-bodyBold text-[12px] text-brand">{activeScript.sourceLanguage.toUpperCase()}</Text>
        </View>
        <Text className="font-body text-[15px] leading-6 text-ink">{recognized || '...'}</Text>
      </Card>
      <Card className={`gap-2 ${translated ? 'border-brand bg-brandSoft' : ''}`}>
        <View className="flex-row items-center justify-between">
          <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('translate.translatedResult')}</Text>
          <Text className="font-bodyBold text-[12px] text-brand">{activeScript.targetLanguage.toUpperCase()}</Text>
        </View>
        <Text className="font-body text-[15px] leading-6 text-ink">{translated || '...'}</Text>
      </Card>
    </Screen>
  );
}
