export type CoveragePreference = 'budget' | 'balanced' | 'mentalHealth' | 'extras' | 'family';

export type OshcPlan = {
  id: string;
  name: string;
  provider: string;
  monthlyPrice: number;
  coverageLevel: 'core' | 'balanced' | 'plus';
  tags: string[];
  extras: string[];
  pros: string[];
  cons: string[];
  supportPhone: string;
  scoreProfile: Record<CoveragePreference, number>;
};

export type QuizOption = {
  id: string;
  labelKey: string;
  weights: Partial<Record<CoveragePreference, number>>;
};

export type QuizQuestion = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  options: QuizOption[];
};
