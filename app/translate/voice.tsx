import { useMemo, useState } from 'react';
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

export default function VoiceTranslateScreen() {
  const { t } = useTranslation();
  const { isPremium } = useUser();
  const [activeId, setActiveId] = useState<(typeof voiceScripts)[number]['id']>(voiceScripts[0].id);
  const [phase, setPhase] = useState<'idle' | 'listening' | 'done'>('idle');
  const [recognized, setRecognized] = useState('');
  const [translated, setTranslated] = useState('');

  const activeScript = useMemo(() => voiceScripts.find((item) => item.id === activeId) ?? voiceScripts[0], [activeId]);

  function runDemo() {
    setPhase('listening');
    setRecognized('');
    setTranslated('');

    setTimeout(() => {
      setRecognized(activeScript.input);
    }, 1200);

    setTimeout(() => {
      setTranslated(activeScript.output);
      setPhase('done');
    }, 1800);
  }

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
        <View className="items-center justify-center rounded-[30px] bg-[#f9efea] px-6 py-12">
          <Text className="font-display text-[40px] text-brand">●</Text>
          <Text className="mt-3 font-body text-[14px] uppercase tracking-[2px] text-muted">
            {phase === 'listening' ? t('translate.listening') : t('translate.startListening')}
          </Text>
        </View>
        <Button label={t('translate.startListening')} onPress={runDemo} />
      </Card>
      <Card className="gap-2">
        <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('translate.recognized')}</Text>
        <Text className="font-body text-[15px] leading-6 text-ink">{recognized || '...'}</Text>
      </Card>
      <Card className="gap-2">
        <Text className="font-body text-[12px] uppercase tracking-[1.8px] text-muted">{t('translate.translatedResult')}</Text>
        <Text className="font-body text-[15px] leading-6 text-ink">{translated || '...'}</Text>
      </Card>
    </Screen>
  );
}
