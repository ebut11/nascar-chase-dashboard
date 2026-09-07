# The Model Duel — 2026 NASCAR Chase

A season-long, race-by-race scoreboard for a modeling experiment: a **basic**
box-score Random Forest vs. an **advanced** engineered-metric Random Forest, both
projecting the finishing order for every race of the 2026 NASCAR Playoffs. After
each race, both models are graded against the actual result.

**Stack:** Next.js (App Router) · shadcn/ui · Supabase (Postgres) · deployed on Vercel.

## What's here

| Route | Content |
|-------|---------|
| `/` | Season "duel" scoreboard, Chase schedule strip, latest-race summary |
| `/races/[round]` | Per-race: predictions (basic vs advanced), predicted-vs-actual board, accuracy metrics, feature importances |
| `/methodology` | How the models are built, blended, cross-validated, and scored |

Races 2–10 render an "upcoming" state until their predictions are loaded.

## Data

Supabase schema (`supabase/01_schema.sql`) — six tables, all public read-only via RLS:

- `races` — the 10 Chase rounds
- `drivers` — name, car number, chase-driver flag
- `predictions` — projected finish per race × driver × model
- `results` — actual finish + loop data per race × driver
- `model_scores` — precomputed MAE / RMSE / R² / hit-rate per race × model
- `feature_importances` — Gini importance per race × model

`supabase/02_seed.sql` loads the Darlington (race 1) data. Regenerate both the
seed and the bundled fallback with the project's Python generator when new race
data lands.

If `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset, the app
falls back to `src/lib/fallback-data.json` (the Darlington snapshot) so it always
renders.

## Local development

```bash
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm install
npm run dev
```

## Deploy

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as
   environment variables.
4. In Supabase, run `supabase/01_schema.sql` then `supabase/02_seed.sql` in the
   SQL editor.
