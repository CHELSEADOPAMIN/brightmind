import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';

import { TranslationError, translateText } from '@/lib/api/google-translate';

type TranslationRecord = {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  translatedText: string;
  createdAt: string;
};

type TranslationContextValue = {
  state: {
    sourceLanguage: string;
    targetLanguage: string;
    sourceText: string;
    translatedText: string;
    history: TranslationRecord[];
  };
  actions: {
    setSourceLanguage: (language: string) => void;
    setTargetLanguage: (language: string) => void;
    setSourceText: (value: string) => void;
    swapLanguages: () => void;
    runTranslation: (value?: string) => Promise<void>;
    removeHistoryRecord: (id: string) => void;
    clearOutput: () => void;
  };
  meta: {
    isTranslating: boolean;
    errorCode: 'browserNotSupported' | 'notConfigured' | 'requestFailed' | null;
  };
};

const STORAGE_KEY = 'brightmind.translation.history';
const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationProvider({ children }: PropsWithChildren) {
  const [sourceLanguage, setSourceLanguage] = useState('zh');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [history, setHistory] = useState<TranslationRecord[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [errorCode, setErrorCode] = useState<'browserNotSupported' | 'notConfigured' | 'requestFailed' | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!stored) {
        return;
      }

      try {
        setHistory(JSON.parse(stored) as TranslationRecord[]);
      } catch {
        // Ignore history parsing problems in mock mode.
      }
    });
  }, []);

  useEffect(() => {
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const value = useMemo<TranslationContextValue>(
    () => ({
      state: {
        sourceLanguage,
        targetLanguage,
        sourceText,
        translatedText,
        history,
      },
      actions: {
        setSourceLanguage,
        setTargetLanguage,
        setSourceText,
        swapLanguages: () => {
          setSourceLanguage(targetLanguage);
          setTargetLanguage(sourceLanguage);
          setSourceText(translatedText);
          setTranslatedText(sourceText);
          setErrorCode(null);
        },
        runTranslation: async (valueOverride) => {
          const nextText = valueOverride ?? sourceText;
          const nextRequestId = requestIdRef.current + 1;
          requestIdRef.current = nextRequestId;

          if (!nextText.trim()) {
            setTranslatedText('');
            setErrorCode(null);
            return;
          }

          if (sourceLanguage === targetLanguage) {
            setTranslatedText(nextText);
            setErrorCode(null);
            return;
          }

          setIsTranslating(true);
          setErrorCode(null);

          try {
            const output = await translateText({
              sourceLanguage,
              sourceText: nextText,
              targetLanguage,
            });

            if (requestIdRef.current !== nextRequestId) {
              return;
            }

            setTranslatedText(output);
            setHistory((current) => [
              {
                id: `${Date.now()}`,
                sourceLanguage,
                targetLanguage,
                sourceText: nextText,
                translatedText: output,
                createdAt: new Date().toISOString(),
              },
              ...current,
            ].slice(0, 6));
          } catch (error) {
            if (requestIdRef.current !== nextRequestId) {
              return;
            }

            setTranslatedText('');
            setErrorCode(error instanceof TranslationError ? error.code : 'requestFailed');
          } finally {
            if (requestIdRef.current === nextRequestId) {
              setIsTranslating(false);
            }
          }
        },
        removeHistoryRecord: (id) => {
          setHistory((current) => current.filter((record) => record.id !== id));
        },
        clearOutput: () => {
          requestIdRef.current += 1;
          setTranslatedText('');
          setErrorCode(null);
          setIsTranslating(false);
        },
      },
      meta: {
        isTranslating,
        errorCode,
      },
    }),
    [errorCode, history, isTranslating, sourceLanguage, sourceText, targetLanguage, translatedText],
  );

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslationService() {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useTranslationService must be used within TranslationProvider');
  }

  return context;
}
