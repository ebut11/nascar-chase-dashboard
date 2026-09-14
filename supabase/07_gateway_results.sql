-- Standalone: Gateway (race 2) actual results + model scores.
-- Safe to re-run; replaces any existing Gateway results/model_scores rows.
begin;

update races set status = 'completed', winner = 'Kyle Larson' where chase_round = 2;

delete from results where race_id = (select id from races where chase_round = 2);

insert into results (race_id, driver_id, start_pos, finish_pos, status, avg_running_position, fastest_laps, laps_led, pct_led, quality_passes, pct_top15) values
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Kyle Larson'), 2, 1, 'Running', 3.80, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Alex Bowman'), 11, 2, 'Running', 11.91, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Joey Logano'), 1, 3, 'Running', 3.00, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'William Byron'), 24, 4, 'Running', 15.17, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Ross Chastain'), 20, 5, 'Running', 10.94, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Austin Dillon'), 22, 6, 'Running', 19.24, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Connor Zilisch'), 19, 7, 'Running', 17.21, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Carson Hocevar'), 6, 8, 'Running', 13.28, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Denny Hamlin'), 10, 9, 'Running', 10.17, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Austin Cindric'), 13, 10, 'Running', 14.49, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Cole Custer'), 26, 11, 'Running', 22.73, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Brad Keselowski'), 23, 12, 'Running', 5.49, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Erik Jones'), 25, 13, 'Running', 14.75, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Bubba Wallace'), 7, 14, 'Running', 17.81, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'John Hunter Nemechek'), 28, 15, 'Running', 18.91, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'AJ Allmendinger'), 17, 16, 'Running', 26.51, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Ryan Preece'), 14, 17, 'Running', 12.30, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Ty Gibbs'), 9, 18, 'Running', 13.22, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Christopher Bell'), 4, 19, 'Running', 12.06, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Michael McDowell'), 29, 20, 'Running', 32.55, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Austin Hill'), 27, 21, 'Running', 22.96, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Cody Ware'), 30, 22, 'Running', 32.96, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Shane Van Gisbergen'), 35, 23, 'Running', 25.65, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Todd Gilliland'), 34, 24, 'Running', 25.25, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Tyler Reddick'), 18, 25, 'Running', 13.90, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Ricky Stenhouse Jr.'), 36, 26, 'Running', 27.11, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Chris Buescher'), 21, 27, 'DNF', 26.90, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Josh Berry'), 16, 28, 'Running', 9.18, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Daniel Suarez'), 15, 29, 'DNF', 18.50, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Ty Dillon'), 32, 30, 'DNF', 29.50, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Chase Elliott'), 8, 31, 'DNF', 10.02, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Chase Briscoe'), 5, 32, 'DNF', 12.86, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Noah Gragson'), 31, 33, 'DNF', 31.53, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Riley Herbst'), 33, 34, 'DNF', 32.80, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Ryan Blaney'), 3, 35, 'DNF', 6.12, null, null, null, null, null),
  ((select id from races where chase_round = 2), (select id from drivers where name = 'Zane Smith'), 12, 36, 'DNF', 24.71, null, null, null, null, null);

delete from model_scores where race_id = (select id from races where chase_round = 2);

insert into model_scores (race_id, model_type, cv_mae, cv_r2, mae, rmse, r2, top5_hits, top10_hits, predicted_winner, predicted_winner_actual_finish) values
  ((select id from races where chase_round = 2), 'basic', 2.653, 0.719, 9.73, 11.49, -0.223, 1, 4, 'Denny Hamlin', 9),
  ((select id from races where chase_round = 2), 'advanced', 2.309, 0.781, 9.95, 11.8, -0.291, 1, 3, 'Christopher Bell', 19);

commit;
