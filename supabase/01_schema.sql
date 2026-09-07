-- ============================================================
--  NASCAR 2026 Chase Dashboard — Supabase schema
--  Run this first in the Supabase SQL editor.
-- ============================================================

drop table if exists feature_importances cascade;
drop table if exists model_scores cascade;
drop table if exists results cascade;
drop table if exists predictions cascade;
drop table if exists drivers cascade;
drop table if exists races cascade;

-- --- Races: the 10-race 2026 postseason (non-elimination points format) ---
create table races (
  id              serial primary key,
  chase_round     int  not null unique,       -- 1..10
  name            text not null,              -- official event name
  track           text not null,
  race_date       date,
  track_type      text,                       -- Intermediate / Short Track / Superspeedway
  track_length_mi numeric(4,3),
  status          text not null default 'upcoming' check (status in ('upcoming','completed')),
  winner          text,
  blend_note      text,                       -- history/season-form blend used for this race
  created_at      timestamptz default now()
);

-- --- Drivers ---
create table drivers (
  id              serial primary key,
  name            text not null unique,
  car_number      int,
  is_chase_driver boolean not null default false
);

-- --- Model predictions: one row per race x driver x model ---
create table predictions (
  id               serial primary key,
  race_id          int not null references races(id) on delete cascade,
  driver_id        int not null references drivers(id) on delete cascade,
  model_type       text not null check (model_type in ('basic','advanced')),
  projected_finish numeric(4,1) not null,
  data_source      text,
  unique (race_id, driver_id, model_type)
);

-- --- Actual results with loop data ---
create table results (
  id                   serial primary key,
  race_id              int not null references races(id) on delete cascade,
  driver_id            int not null references drivers(id) on delete cascade,
  start_pos            int,
  finish_pos           int not null,
  status               text,
  avg_running_position numeric(5,2),
  fastest_laps         int,
  laps_led             int,
  pct_led              numeric(5,2),
  quality_passes       int,
  pct_top15            numeric(5,2),
  unique (race_id, driver_id)
);

-- --- Precomputed model accuracy per race x model ---
create table model_scores (
  id                             serial primary key,
  race_id                        int not null references races(id) on delete cascade,
  model_type                     text not null check (model_type in ('basic','advanced')),
  cv_mae                         numeric(5,2),
  cv_r2                          numeric(5,3),
  mae                            numeric(5,2),
  rmse                           numeric(5,2),
  r2                             numeric(5,3),
  top5_hits                      int,   -- of predicted top 5, how many actually finished top 5
  top10_hits                     int,
  predicted_winner               text,
  predicted_winner_actual_finish int,
  unique (race_id, model_type)
);

-- --- Feature importances per race x model ---
create table feature_importances (
  id          serial primary key,
  race_id     int not null references races(id) on delete cascade,
  model_type  text not null check (model_type in ('basic','advanced')),
  feature     text not null,
  importance  numeric(6,4) not null,
  unique (race_id, model_type, feature)
);

create index on predictions (race_id, model_type);
create index on results (race_id);
create index on feature_importances (race_id, model_type);

-- ============================================================
--  Row Level Security: public (anon) read-only, no client writes
-- ============================================================
alter table races               enable row level security;
alter table drivers             enable row level security;
alter table predictions         enable row level security;
alter table results             enable row level security;
alter table model_scores        enable row level security;
alter table feature_importances enable row level security;

create policy "public read" on races               for select using (true);
create policy "public read" on drivers             for select using (true);
create policy "public read" on predictions         for select using (true);
create policy "public read" on results             for select using (true);
create policy "public read" on model_scores        for select using (true);
create policy "public read" on feature_importances for select using (true);
