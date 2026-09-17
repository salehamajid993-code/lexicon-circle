# Lexicon Circle — Deep Audit and Freeze Record

**Audit date:** 2026-09-17  
**Scope:** Master Prompt 1 only: preserve the approved website, ensure lightweight transitions, and establish the Learning Zone foundation.

## Existing application inventory

The project is a Vite + React 19 + TypeScript application using Wouter for client-side routing, Tailwind CSS 4, Lucide icons, Framer Motion as an available dependency, and a lightweight CSS page-enter animation already used by the shared layout. The application is wrapped in `ErrorBoundary` and `ThemeProvider`.

| Area | Existing implementation | Freeze decision |
|---|---|---|
| Routes | `/`, `/programs`, `/programs/:slug`, `/camps`, `/quiz`, `/learning-zone`, `/learning-zone/games/:gameId`, `/about`, `/contact`, `/404`, plus a fallback Not Found route | Preserve routing architecture and all existing paths |
| Layout | `SiteLayout.tsx` owns fixed responsive navigation, mobile menu, scroll behavior, page transition wrapper, and footer | Reuse unchanged; Learning Zone is already a native nav item |
| Visual language | Warm paper background `#fff9e8`, charcoal ink `#263238`, coral accent `#f58f82`, butter accent `#f9d96b`, soft border `#e8ddc6`, Fraunces headings, Nunito body copy, story-card shadows, rounded cards | Locked; new UI inherits these tokens |
| Transitions | `.page-transition` uses a 240ms opacity/translate entrance; reduced-motion rules are present | Keep existing transition system; no new animation dependency |
| Shared components | `ContentBlocks`, `Illustrations`, `LearningGameCard`, `LearningGameEngine`, `ErrorBoundary`, FAQ and media components | Reuse; only Learning Zone data/page foundation changed |
| Existing content | Site data contains approved/placeholder-aware programs, camps, stories, words, FAQs, founder, and feature content | Do not rewrite or remove |
| Backend/config | Express server entry exists, but the requested foundation needs no database, auth, API, or new environment variables | No backend changes |
| Assets | Existing asset references use Manus storage paths; no new media added | Preserve assets; no public media added |

## Protected implementation list

The following are frozen for subsequent prompts unless explicitly requested: homepage content and sections; Programs; Program Details; Camps; Quiz; About; Contact; Not Found behavior; navbar and footer; existing images and illustrations; existing buttons and cards; typography, colors, spacing, responsive behavior, dependencies, content, and working functionality.

## Changes made in this prompt

1. Added `client/src/data/learningZoneData.ts` as the data-driven source for categories, all 18 planned games, difficulty options, age/grade filter placeholders, writing preview metadata, and etymology preview metadata.
2. Updated `client/src/pages/LearningZone.tsx` to consume the centralized data and provide category filtering, difficulty filtering, age/grade UI placeholders, the complete planned game-card list, progress-preview slots for Games Completed, Points, Badges, Writing Progress, and Current Level, plus writing-practice and etymology preview cards.
3. Left the existing router, shared layout, global styles, existing pages, game engine, playable game data, and backend unchanged.

## Intentional non-features

This foundation does not claim to provide persistent progress, authentication, child profiles, scoring, badges, rewards, AI evaluation, etymology facts, admin tools, payment functionality, or complete game mechanics. Available game cards link only to the existing playable-game routes; other cards clearly remain in a coming-soon state.

## Verification checklist

- [x] `pnpm check` passed.
- [x] `pnpm build` passed.
- [x] Existing route smoke tests returned HTTP 200 for all preserved routes, the playable game route, and the fallback route.
- [x] Responsive layout is implemented with the existing mobile-first grid/flex breakpoints and no new fixed-width elements.
- [x] No new console-producing integrations, assets, API calls, or backend changes were introduced; visual review should continue in the next connected preview session.

This record should be treated as the baseline for the next master prompt.
