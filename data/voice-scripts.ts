export const voiceScripts = [
  {
    id: 'zh-en',
    sourceLanguage: 'zh',
    targetLanguage: 'en',
    input: '我最近总是睡不好，而且压力很大。',
    output: 'I have been sleeping badly lately, and I feel overwhelmed.',
  },
  {
    id: 'fr-en',
    sourceLanguage: 'fr',
    targetLanguage: 'en',
    input: "Je cherche un psychologue qui comprend la vie étudiante.",
    output: 'I am looking for a psychologist who understands student life.',
  },
  {
    id: 'es-en',
    sourceLanguage: 'es',
    targetLanguage: 'en',
    input: 'Necesito reservar una cita para esta semana.',
    output: 'I need to book an appointment for this week.',
  },
] as const;
