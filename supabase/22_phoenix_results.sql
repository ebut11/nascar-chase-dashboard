-- Phoenix (race 7) actual results + model scores. Safe to re-run.
begin;

update races set status = 'completed', winner = 'Tyler Reddick' where chase_round = 7;

delete from results where race_id = (select id from races where chase_round = 7);
delete from model_scores where race_id = (select id from races where chase_round = 7);

insert into results (race_id, driver_id, start_pos, finish_pos, status, avg_running_position, fastest_laps, laps_led, pct_led, quality_passes, pct_top15)
select r.id, d.id, x.st, x.fin, x.status, x.arp, x.fl, x.led, x.pled, x.qp, x.t15
from (values
  ('Tyler Reddick',6,1,'Running',7.13,17,18,5.77,61,96.15),
  ('Ryan Blaney',1,2,'Running',4.63,41,51,16.35,72,99.04),
  ('Chase Elliott',16,3,'Running',9.97,2,0,0.0,68,98.4),
  ('Christopher Bell',5,4,'Running',3.37,27,85,27.24,37,99.36),
  ('Corey Heim',36,5,'Running',22.93,2,0,0.0,18,14.42),
  ('Joey Logano',2,6,'Running',3.05,31,84,26.92,22,98.72),
  ('Daniel Suarez',14,7,'Running',14.91,1,0,0.0,64,59.94),
  ('Chase Briscoe',3,8,'Running',3.67,13,13,4.17,32,100.0),
  ('Ross Chastain',11,9,'Running',10.12,1,0,0.0,90,98.4),
  ('Ty Gibbs',7,10,'Running',17.0,1,2,0.64,45,46.79),
  ('Josh Berry',9,11,'Running',6.32,29,1,0.32,72,98.72),
  ('Carson Hocevar',28,12,'Running',17.79,7,0,0.0,65,47.44),
  ('Noah Gragson',30,13,'Running',24.59,2,0,0.0,6,4.81),
  ('Todd Gilliland',13,14,'Running',11.11,2,0,0.0,83,93.27),
  ('Zane Smith',20,15,'Running',22.46,0,0,0.0,34,25.64),
  ('Brad Keselowski',18,16,'Running',16.5,0,0,0.0,24,47.76),
  ('Bubba Wallace',23,17,'Running',8.52,29,52,16.67,44,74.36),
  ('Ryan Preece',26,18,'Running',22.37,0,0,0.0,9,4.49),
  ('Austin Cindric',15,19,'Running',14.07,14,0,0.0,62,62.5),
  ('Connor Zilisch',12,20,'Running',15.04,1,0,0.0,29,50.32),
  ('William Byron',10,21,'Running',15.43,1,2,0.64,41,49.04),
  ('Chris Buescher',17,22,'Running',18.47,0,0,0.0,27,26.28),
  ('AJ Allmendinger',21,23,'Running',27.38,0,0,0.0,0,0.0),
  ('Austin Hill',35,24,'Running',26.97,0,0,0.0,0,0.0),
  ('Erik Jones',29,25,'Running',26.78,4,0,0.0,1,0.32),
  ('Shane Van Gisbergen',25,26,'Running',20.57,0,0,0.0,14,8.65),
  ('Cole Custer',27,27,'Running',22.41,0,0,0.0,4,1.28),
  ('Denny Hamlin',4,28,'Running',15.01,2,4,1.29,38,62.06),
  ('Alex Bowman',34,29,'Running',29.36,5,0,0.0,10,2.89),
  ('Ricky Stenhouse Jr.',31,30,'Running',32.65,0,0,0.0,2,0.64),
  ('Ty Dillon',33,31,'Running',32.15,15,0,0.0,0,0.0),
  ('Riley Herbst',19,32,'Running',32.47,0,0,0.0,1,0.0),
  ('John Hunter Nemechek',32,33,'Running',31.63,9,0,0.0,0,0.0),
  ('Kyle Larson',22,34,'Accident',21.98,2,0,0.0,18,6.76),
  ('Cody Ware',37,35,'Accident',33.78,0,0,0.0,1,0.45),
  ('Michael McDowell',8,36,'Running',30.62,2,0,0.0,5,10.95),
  ('Austin Dillon',24,37,'Accident',17.57,1,0,0.0,18,30.32)
) as x(name, st, fin, status, arp, fl, led, pled, qp, t15)
join drivers d on d.name = x.name
join races r on r.chase_round = 7;

insert into model_scores (race_id, model_type, cv_mae, cv_r2, mae, rmse, r2, top5_hits, top10_hits, predicted_winner, predicted_winner_actual_finish)
select r.id, m.* from (values
  ('basic',2.23,0.74,8.7,10.48,0.037,2,5,'Kyle Larson',34),
  ('advanced',2.13,0.74,8.43,10.12,0.101,2,7,'Ryan Blaney',2)
) as m(model_type, cv_mae, cv_r2, mae, rmse, r2, top5_hits, top10_hits, predicted_winner, predicted_winner_actual_finish)
join races r on r.chase_round = 7;

select (select count(*) from results where race_id = (select id from races where chase_round = 7)) as results,
       (select count(*) from model_scores where race_id = (select id from races where chase_round = 7)) as scores;

commit;
