import type { CoveragePreference, OshcPlan, QuizQuestion } from '@/types/oshc';

export function scorePlans(
  plans: OshcPlan[],
  questions: QuizQuestion[],
  answers: Record<string, string>,
) {
  const profile = questions.reduce<Record<CoveragePreference, number>>(
    (accumulator, question) => {
      const selectedOption = question.options.find((option) => option.id === answers[question.id]);

      if (!selectedOption) {
        return accumulator;
      }

      Object.entries(selectedOption.weights).forEach(([key, weight]) => {
        const typedKey = key as CoveragePreference;
        accumulator[typedKey] += weight ?? 0;
      });

      return accumulator;
    },
    {
      budget: 0,
      balanced: 0,
      mentalHealth: 0,
      extras: 0,
      family: 0,
    },
  );

  return plans
    .map((plan) => {
      const score = Object.entries(profile).reduce((sum, [key, weight]) => {
        return sum + (plan.scoreProfile[key as CoveragePreference] ?? 0) * weight;
      }, 0);

      return {
        plan,
        score,
      };
    })
    .sort((left, right) => right.score - left.score);
}
