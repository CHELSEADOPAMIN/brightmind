import { Platform } from 'react-native';

import { hasSupabaseConfig, supabase } from '@/lib/supabase';

type TranslateTextParams = {
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
};

type TranslationErrorCode = 'browserNotSupported' | 'notConfigured' | 'requestFailed';

type DeepLTranslatePayload = {
  translations?: Array<{
    detected_source_language?: string;
    text?: string;
  }>;
  message?: string;
  error?: {
    message?: string;
  };
};

export class TranslationError extends Error {
  constructor(public code: TranslationErrorCode, message?: string) {
    super(message);
    this.name = 'TranslationError';
  }
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function mapToDeepLLanguageCode(language: string) {
  switch (language) {
    case 'zh':
      return 'ZH';
    case 'en':
      return 'EN';
    case 'ne':
      return 'NE';
    case 'es':
      return 'ES';
    default:
      return language.toUpperCase();
  }
}

async function translateWithProxy({ sourceLanguage, sourceText, targetLanguage }: TranslateTextParams) {
  if (!hasSupabaseConfig || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke<{ translatedText?: string }>('translate-text', {
      body: {
        q: sourceText,
        source: sourceLanguage,
        target: targetLanguage,
      },
    });

    if (error || !data?.translatedText) {
      return null;
    }

    return decodeHtmlEntities(data.translatedText);
  } catch {
    return null;
  }
}

export async function translateText({ sourceLanguage, sourceText, targetLanguage }: TranslateTextParams) {
  if (!sourceText.trim()) {
    return '';
  }

  if (sourceLanguage === targetLanguage) {
    return sourceText;
  }

  // Prefer a server-side proxy so the Google key does not ship in the app bundle.
  const proxiedTranslation = await translateWithProxy({
    sourceLanguage,
    sourceText,
    targetLanguage,
  });

  if (proxiedTranslation) {
    return proxiedTranslation;
  }

  if (Platform.OS === 'web') {
    throw new TranslationError(
      'browserNotSupported',
      'DeepL quick mode is blocked in browsers. Use Expo Go on a phone or route requests through your own backend.',
    );
  }

  const apiKey = process.env.EXPO_PUBLIC_DEEPL_API_KEY ?? process.env.DEEPL_API_KEY;

  if (!apiKey) {
    throw new TranslationError(
      'notConfigured',
      'Missing translation configuration. Add EXPO_PUBLIC_DEEPL_API_KEY for mobile quick mode or connect a translate-text proxy.',
    );
  }

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source_lang: mapToDeepLLanguageCode(sourceLanguage),
      target_lang: mapToDeepLLanguageCode(targetLanguage),
      text: [sourceText],
    }),
  });

  const payload = (await response.json()) as DeepLTranslatePayload;

  if (!response.ok) {
    throw new TranslationError('requestFailed', payload.message ?? payload.error?.message ?? 'Translation request failed.');
  }

  const translatedText = payload.translations?.[0]?.text;

  if (!translatedText) {
    throw new TranslationError('requestFailed', 'Translation request returned an empty result.');
  }

  return decodeHtmlEntities(translatedText);
}
