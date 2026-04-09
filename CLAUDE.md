# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What Is This

BrightMind is a presentation-ready mobile app for international students' mental health support in Australia. Built with Expo/React Native, it covers OSHC insurance guidance, nearby doctor finder, text/voice translation, and a credits/membership system. **All features prioritize demo fidelity over production robustness** — doctor booking and voice translation are mocked.

## Commands

```bash
npm start              # Start Expo dev server
npm run start:clear    # Start with cache cleared
npm run start:tunnel   # Start with tunnel (for physical device)
npm run web            # Web-only
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit (strict mode)
npm run format         # Prettier
```

No test suite is configured yet.

## Architecture

### Provider Hierarchy (app/_layout.tsx)
```
ServicesProvider          → Supabase/Clerk config flags (optional, demo works without them)
└─ AppProvider            → User state, bookings, referrals (persisted to AsyncStorage)
   └─ TranslationProvider → Translation source/target/history
      └─ RouteGuard       → Redirects based on auth state
```

All providers follow a `{ state, actions, meta }` context interface pattern. `AppProvider` is the source of truth for auth — it uses a demo sign-in flow (no real Clerk/Supabase required).

### Routing (Expo Router file-based)
- `(auth)/` — sign-in, sign-up (shown when unauthenticated)
- `(tabs)/` — 5 bottom tabs: Home, Finance, Doctor, Translate, Profile
- `finance/`, `doctor/`, `translate/`, `membership/` — stack screens pushed from tabs

### Styling
NativeWind v4 (Tailwind for RN). Custom theme tokens in `tailwind.config.js` and `constants/theme.ts`:
- Colors: `brand` (#df3f35 red), `paper` (warm white bg), `ink` (near-black text), `muted`, `stroke`, `brandSoft`, `brandDeep`
- Fonts: CormorantGaramond (display), Manrope (body) — loaded via `@expo-google-fonts`
- Use `className` props, not `StyleSheet.create`

### i18n
i18next with 4 languages (en/zh/fr/es) in `locales/`. All user-visible text must use `t('key')`. Language changes go through `actions.changeLanguage()` which updates both user state and i18next.

### Translation API
Uses DeepL (not Google Translate). API wrapper in `lib/api/google-translate.ts` with Supabase Edge Function proxy fallback. The `EXPO_PUBLIC_DEEPL_API_KEY` env var is for demo convenience; production should proxy through a backend.

### Data
- OSHC plans: `data/oshc-plans.json` (static, hand-curated)
- Quiz questions: `data/quiz-questions.json` (4 questions, scored in `lib/utils/oshc-scorer.ts`)
- Seed doctors: `data/doctors.ts` (fallback when Google Places unavailable)
- Voice scripts: `data/voice-scripts.ts` (mock dialogue for voice translation demo)

### Platform splits
Files with `.native.tsx` / `.web.tsx` suffixes (e.g., `DoctorMap`) provide platform-specific implementations. Metro resolves the correct one automatically.

## Conventions

- **300-line file limit** — split if approaching
- **No barrel files** — import directly from source
- **Functional composition** — no class components, no deep inheritance
- **YAGNI** — only build what's needed now
- **Readability over DRY** — three similar lines beat a premature abstraction
- **Strict TypeScript** — `tsconfig.json` has `"strict": true`
- **Prettier**: single quotes, trailing commas, semicolons, tailwindcss plugin
- **Path alias**: `@/*` maps to project root (e.g., `@/components/ui/Button`)
- **Conditional rendering**: use ternary (`condition ? <A /> : <B />`), not `&&`
