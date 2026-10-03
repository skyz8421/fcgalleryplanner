# FCGallery

An independent FC 27 Gallery route planner and Set-score checker. The site compares user-entered upgrade options and prices, with shared-card deduplication and estimated sequential resale capital. It does not connect to an EA account or provide a market feed.

## Development

Use Node 24, pnpm 10 and Python 3.12 with google-auth for the build's GA4 ownership check. Copy `.env.example` to `.env.local`, insert this site's own platform IDs, then run `pnpm install` and `pnpm dev`. Python is resolved through the project's pyenv selection, or `GAMESITE_PY` when explicitly provided.

`pnpm build` runs the engine tests, TypeScript and shared site gates before producing `out/`. `pnpm cf:deploy` also requires a review stamp matching the current source.

## Core files

- `lib/engines.ts`: bounded subset enumeration, capital ordering, scoring and share codec.
- `components/Planner.tsx`: editable workspace, browser save, JSON interchange, share fragments and undo.
- `components/ScoreCalculator.tsx`: bonus arithmetic and entered-score comparison.
- `DESIGN.md`: visual tokens and navigation behavior.

Examples are illustrative arithmetic inputs. Confirm prices, targets, eligibility and Gallery progress in the game. The `/sources/` page documents the model's assumptions.

## Privacy and operations

No plan is submitted to a backend. Optional analytics loads after consent and strips the plan fragment from page-view URLs. Do not add card names or plan data to analytics events. All new releases require tests, site gates, independent review, a current review stamp and live verification. Keep provider credentials outside the repository.
