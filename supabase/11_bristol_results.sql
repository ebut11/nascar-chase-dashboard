-- Standalone: Bristol (race 3) actual results + model scores.
-- Safe to re-run; replaces any existing Bristol results/model_scores rows.
begin;

update races set status = 'completed', winner = 'Joey Logano' where chase_round = 3;

delete from results where race_id = (select id from races where chase_round = 3);

insert into results (race_id, driver_id, start_pos, finish_pos, status, avg_running_position, fastest_laps, laps_led, pct_led, quality_passes, pct_top15) values
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Joey Logano'), 2, 1, 'Running', 4.13, 43, 93, 18.6, 57, 99.0),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Kyle Larson'), 1, 2, 'Running', 8.09, 34, 45, 9.0, 62, 97.8),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Carson Hocevar'), 5, 3, 'Running', 7.94, 48, 39, 7.8, 83, 90.6),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Christopher Bell'), 12, 4, 'Running', 6.25, 25, 1, 0.2, 45, 97.0),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Ty Gibbs'), 13, 5, 'Running', 6.67, 73, 120, 24.0, 64, 88.6),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Josh Berry'), 32, 6, 'Running', 11.38, 25, 0, 0.0, 42, 76.6),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Bubba Wallace'), 10, 7, 'Running', 6.64, 22, 0, 0.0, 60, 100.0),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Denny Hamlin'), 3, 8, 'Running', 9.75, 14, 0, 0.0, 64, 95.2),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'William Byron'), 4, 9, 'Running', 7.39, 10, 0, 0.0, 43, 99.8),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Ryan Preece'), 16, 10, 'Running', 15.17, 12, 0, 0.0, 30, 67.6),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Austin Cindric'), 8, 11, 'Running', 10.84, 10, 0, 0.0, 56, 92.6),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Ross Chastain'), 7, 12, 'Running', 13.03, 10, 0, 0.0, 59, 77.8),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Chris Buescher'), 23, 13, 'Running', 10.16, 5, 0, 0.0, 50, 89.38),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Daniel Suarez'), 28, 14, 'Running', 21.75, 0, 0, 0.0, 12, 7.83),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Brad Keselowski'), 11, 15, 'Running', 16.17, 1, 0, 0.0, 26, 22.69),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Noah Gragson'), 36, 16, 'Running', 19.59, 0, 0, 0.0, 13, 19.08),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Austin Dillon'), 9, 17, 'Running', 18.25, 2, 0, 0.0, 34, 27.71),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Tyler Reddick'), 20, 18, 'Running', 29.85, 6, 0, 0.0, 0, 0.0),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Todd Gilliland'), 24, 19, 'Running', 22.13, 0, 0, 0.0, 13, 7.65),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Shane Van Gisbergen'), 22, 20, 'Running', 25.21, 0, 0, 0.0, 0, 0.8),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Michael McDowell'), 21, 21, 'Running', 22.66, 0, 0, 0.0, 16, 3.82),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'AJ Allmendinger'), 18, 22, 'Running', 23.04, 1, 0, 0.0, 0, 0.0),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Chase Elliott'), 27, 23, 'Running', 23.43, 0, 0, 0.0, 20, 5.23),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Connor Zilisch'), 15, 24, 'Running', 25.43, 7, 0, 0.0, 3, 10.28),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'John Hunter Nemechek'), 19, 25, 'Running', 27.37, 0, 0, 0.0, 4, 6.46),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Cole Custer'), 17, 26, 'Running', 27.89, 0, 0, 0.0, 0, 0.0),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Chase Briscoe'), 26, 27, 'Suspension', 12.22, 6, 0, 0.0, 51, 85.83),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Zane Smith'), 35, 28, 'Running', 27.49, 0, 0, 0.0, 0, 0.0),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Austin Hill'), 25, 29, 'Running', 28.91, 0, 0, 0.0, 6, 2.23),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Ricky Stenhouse Jr.'), 31, 30, 'Running', 30.07, 0, 0, 0.0, 0, 0.0),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Cody Ware'), 30, 31, 'Running', 34.14, 0, 0, 0.0, 0, 0.0),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Erik Jones'), 14, 32, 'Running', 32.3, 1, 0, 0.0, 2, 0.21),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Ryan Blaney'), 29, 33, 'Accident', 4.75, 53, 202, 44.2, 36, 91.03),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Riley Herbst'), 34, 34, 'Suspension', 21.09, 0, 0, 0.0, 15, 5.32),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Alex Bowman'), 6, 35, 'Accident', 14.48, 3, 0, 0.0, 51, 49.3),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Ty Dillon'), 33, 36, 'Running', 36.65, 0, 0, 0.0, 0, 0.0),
  ((select id from races where chase_round = 3), (select id from drivers where name = 'Josh Bilicki'), 37, 37, 'Suspension', 35.48, 0, 0, 0.0, 0, 0.0);

delete from model_scores where race_id = (select id from races where chase_round = 3);

insert into model_scores (race_id, model_type, cv_mae, cv_r2, mae, rmse, r2, top5_hits, top10_hits, predicted_winner, predicted_winner_actual_finish) values
  ((select id from races where chase_round = 3), 'basic', 2.52, 0.82, 6.16, 8.08, 0.427, 3, 7, 'Ty Gibbs', 5),
  ((select id from races where chase_round = 3), 'advanced', 1.74, 0.9, 6.22, 8.18, 0.413, 3, 6, 'Denny Hamlin', 8);

commit;
