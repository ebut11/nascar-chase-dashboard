-- Standalone: Kansas (race 4) actual results + model scores.
-- Safe to re-run; replaces any existing Kansas results/model_scores rows.
begin;

update races set status = 'completed', winner = 'Kyle Larson' where chase_round = 4;

delete from results where race_id = (select id from races where chase_round = 4);

insert into results (race_id, driver_id, start_pos, finish_pos, status, avg_running_position, fastest_laps, laps_led, pct_led, quality_passes, pct_top15) values
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Kyle Larson'), 2, 1, 'Running', 1.3, 88, 235, 88.01, 14, 99.63),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Austin Cindric'), 11, 2, 'Running', 3.34, 30, 1, 0.37, 37, 99.63),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Denny Hamlin'), 6, 3, 'Running', 3.4, 6, 2, 0.75, 28, 100.0),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Chase Briscoe'), 23, 4, 'Running', 7.01, 22, 23, 8.61, 56, 96.63),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Ryan Blaney'), 25, 5, 'Running', 10.03, 24, 4, 1.5, 51, 87.64),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Christopher Bell'), 3, 6, 'Running', 5.76, 19, 0, 0.0, 43, 99.25),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'William Byron'), 8, 7, 'Running', 5.75, 1, 0, 0.0, 26, 97.38),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Chase Elliott'), 18, 8, 'Running', 9.12, 4, 0, 0.0, 38, 98.5),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Bubba Wallace'), 7, 9, 'Running', 14.85, 17, 0, 0.0, 33, 57.3),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Ryan Preece'), 9, 10, 'Running', 12.73, 2, 0, 0.0, 29, 93.63),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Tyler Reddick'), 15, 11, 'Running', 18.97, 0, 0, 0.0, 14, 44.19),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Brad Keselowski'), 16, 12, 'Running', 15.0, 2, 0, 0.0, 33, 43.82),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'John Hunter Nemechek'), 26, 13, 'Running', 20.44, 0, 0, 0.0, 19, 26.59),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Daniel Suarez'), 14, 14, 'Running', 15.67, 0, 0, 0.0, 36, 48.31),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Ross Chastain'), 13, 15, 'Running', 23.33, 1, 1, 0.37, 10, 3.75),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Erik Jones'), 30, 16, 'Running', 18.0, 0, 0, 0.0, 17, 31.09),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Ty Gibbs'), 5, 17, 'Running', 12.27, 0, 0, 0.0, 35, 79.78),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Alex Bowman'), 33, 18, 'Running', 20.01, 2, 0, 0.0, 16, 20.97),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Todd Gilliland'), 20, 19, 'Running', 19.16, 3, 0, 0.0, 18, 8.24),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Joey Logano'), 1, 20, 'Running', 8.21, 0, 0, 0.0, 38, 98.88),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Austin Dillon'), 19, 21, 'Running', 23.09, 0, 0, 0.0, 0, 0.0),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'AJ Allmendinger'), 24, 22, 'Running', 24.38, 0, 0, 0.0, 0, 1.5),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Chris Buescher'), 12, 23, 'Running', 18.75, 1, 0, 0.0, 21, 48.5),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Shane Van Gisbergen'), 17, 24, 'Running', 21.71, 0, 0, 0.0, 14, 13.53),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Riley Herbst'), 34, 25, 'Running', 26.79, 0, 0, 0.0, 5, 1.5),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Austin Hill'), 32, 26, 'Running', 26.25, 0, 0, 0.0, 5, 1.5),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Michael McDowell'), 22, 27, 'Running', 24.56, 2, 0, 0.0, 8, 3.38),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Ty Dillon'), 36, 28, 'Running', 28.61, 1, 0, 0.0, 2, 0.38),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Connor Zilisch'), 27, 29, 'Running', 32.88, 0, 1, 0.38, 0, 1.5),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Cole Custer'), 29, 30, 'Running', 30.51, 0, 0, 0.0, 0, 1.5),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Zane Smith'), 28, 31, 'Running', 26.9, 1, 0, 0.0, 0, 0.75),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Ricky Stenhouse Jr.'), 31, 32, 'Running', 29.72, 0, 0, 0.0, 3, 0.75),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Carson Hocevar'), 4, 33, 'Running', 19.55, 4, 0, 0.0, 18, 46.21),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Cody Ware'), 35, 34, 'Running', 34.89, 0, 0, 0.0, 0, 0.0),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Josh Berry'), 10, 35, 'Running', 23.48, 5, 0, 0.0, 20, 45.91),
  ((select id from races where chase_round = 4), (select id from drivers where name = 'Noah Gragson'), 21, 36, 'Engine', 20.15, 0, 0, 0.0, 0, 0.89);

delete from model_scores where race_id = (select id from races where chase_round = 4);

insert into model_scores (race_id, model_type, cv_mae, cv_r2, mae, rmse, r2, top5_hits, top10_hits, predicted_winner, predicted_winner_actual_finish) values
  ((select id from races where chase_round = 4), 'basic', 2.2, 0.76, 6.29, 7.5, 0.478, 2, 7, 'Denny Hamlin', 3),
  ((select id from races where chase_round = 4), 'advanced', 1.73, 0.83, 6.18, 7.46, 0.484, 2, 6, 'Denny Hamlin', 3);

commit;
