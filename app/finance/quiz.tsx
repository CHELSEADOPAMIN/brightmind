import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import plansData from '@/data/oshc-plans.json';
import questionsData from '@/data/quiz-questions.json';
import { PlanCard } from '@/components/finance/PlanCard';
import { PremiumGate } from '@/components/PremiumGate';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useUser } from '@/hooks/useUser';
import { scorePlans } from '@/lib/utils/oshc-scorer';
import type { OshcPlan, QuizQuestion } from '@/types/oshc';

const plans = plansData as OshcPlan[];
const questions = questionsData as QuizQuestion[];

export default function FinanceQuizScreen() {
  const { t } = useTranslation();
  const { isPremium } = useUser();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);

  const currentQuestion = questions[step];
  const ranked = useMemo(() => scorePlans(plans, questions, answers), [answers]);
  const isFinished = step >= questions.length;

  if (!isPremium) {
    return (
      <Screen>
        <SectionHeading title={t('finance.quiz.startTitle')} description={t('finance.quiz.startBody')} />
        <PremiumGate
          onUpgrade={() => router.push('/membership/plans')}
          previewDescription={t('finance.quizBody')}
          previewTitle={t('finance.quizTitle')}
        >
          <View />
        </PremiumGate>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeading title={t('finance.quiz.startTitle')} description={t('finance.quiz.startBody')} />
      {isFinished ? (
        <Card className="gap-4">
          <View className="gap-2">
            <Text className="font-display text-[32px] text-ink">{t('finance.quiz.resultTitle')}</Text>
            <Text className="font-body text-[15px] leading-6 text-muted">{t('finance.quiz.resultBody')}</Text>
          </View>
          {ranked.slice(0, 3).map(({ plan }, index) => (
            <PlanCard key={plan.id} active={index === 0} plan={plan} />
          ))}
        </Card>
      ) : (
        <Card className="gap-4">
          <View className="gap-2">
            <Text className="font-display text-[32px] text-ink">{t(currentQuestion.titleKey)}</Text>
            <Text className="font-body text-[15px] leading-6 text-muted">{t(currentQuestion.descriptionKey)}</Text>
          </View>
          {currentQuestion.options.map((option) => {
            const selected = answers[currentQuestion.id] === option.id;

            return (
              <Pressable
                key={option.id}
                className={`rounded-[22px] border px-4 py-4 ${selected ? 'border-brand bg-brandSoft' : 'border-stroke bg-white'}`}
                onPress={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: option.id }))}
              >
                <Text className="font-bodyBold text-[15px] text-ink">{t(option.labelKey)}</Text>
              </Pressable>
            );
          })}
          <View className="flex-row gap-3">
            <Button disabled={step === 0} label={t('common.back')} onPress={() => setStep((current) => Math.max(0, current - 1))} variant="outline" />
            <View className="flex-1">
              <Button
                disabled={!answers[currentQuestion.id]}
                label={step === questions.length - 1 ? t('common.done') : t('common.next')}
                onPress={() => setStep((current) => current + 1)}
              />
            </View>
          </View>
        </Card>
      )}
    </Screen>
  );
}
