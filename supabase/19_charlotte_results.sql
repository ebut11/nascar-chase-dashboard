-- Charlotte (race 6) actual results + model scores. Safe to re-run.
begin;

insert into drivers (name, car_number, is_chase_driver) values
  ('Gray Gaulding', 66, false),
  ('BJ McLeod', 44, false)
on conflict (name) do nothing;

update races set status = 'completed', winner = 'Chase Briscoe' where chase_round = 6;

delete from results where race_id = (select id from races where chase_round = 6);
delete from model_scores where race_id = (select id from races where chase_round = 6);

insert into results (race_id, driver_id, start_pos, finish_pos, status, avg_running_position, fastest_laps, laps_led, pct_led, quality_passes, pct_top15)
select r.id, d.id, x.st, x.fin, x.status, x.arp, x.fl, x.led, x.pled, x.qp, x.t15
from (values
  ('Chase Briscoe',2,1,'Running',3.57,29,62,23.22,32,100.0),
  ('Christopher Bell',17,2,'Running',3.6,70,93,34.83,33,97.38),
  ('Ryan Blaney',4,3,'Running',6.43,25,4,1.5,22,86.14),
  ('Josh Berry',27,4,'Running',11.62,9,0,0.0,33,70.04),
  ('Denny Hamlin',12,5,'Running',7.22,11,0,0.0,33,83.52),
  ('Kyle Larson',1,6,'Running',3.13,21,97,36.33,20,100.0),
  ('Shane Van Gisbergen',10,7,'Running',12.2,1,0,0.0,77,76.4),
  ('Tyler Reddick',3,8,'Running',5.46,13,0,0.0,43,98.13),
  ('Joey Logano',7,9,'Running',12.84,1,0,0.0,39,83.9),
  ('Chris Buescher',13,10,'Running',15.56,0,0,0.0,30,54.31),
  ('Corey Heim',37,11,'Running',14.34,3,0,0.0,52,83.15),
  ('Chase Elliott',9,12,'Running',15.16,2,0,0.0,40,56.55),
  ('Daniel Suarez',15,13,'Running',14.33,0,0,0.0,54,67.79),
  ('Carson Hocevar',11,14,'Running',11.49,0,0,0.0,49,85.77),
  ('Ryan Preece',24,15,'Running',24.3,0,0,0.0,1,2.25),
  ('Ross Chastain',28,16,'Running',14.65,0,0,0.0,73,79.4),
  ('Austin Cindric',5,17,'Running',7.49,11,0,0.0,47,93.26),
  ('Riley Herbst',21,18,'Running',20.22,0,0,0.0,15,11.99),
  ('Michael McDowell',19,19,'Running',16.71,0,0,0.0,30,37.83),
  ('Zane Smith',34,20,'Running',24.04,0,0,0.0,3,1.87),
  ('Connor Zilisch',36,21,'Running',25.23,0,0,0.0,0,0.75),
  ('Todd Gilliland',31,22,'Running',27.45,0,0,0.0,0,0.0),
  ('Ricky Stenhouse Jr.',32,23,'Running',20.77,0,0,0.0,1,1.87),
  ('Erik Jones',25,24,'Running',23.31,0,0,0.0,3,2.25),
  ('Noah Gragson',23,25,'Running',24.43,0,0,0.0,0,1.12),
  ('Austin Dillon',20,26,'Running',18.64,0,0,0.0,15,18.73),
  ('Cole Custer',30,27,'Running',26.3,0,0,0.0,0,0.0),
  ('AJ Allmendinger',18,28,'Running',24.04,0,0,0.0,0,0.75),
  ('Brad Keselowski',22,29,'Running',28.52,0,0,0.0,0,1.13),
  ('Ty Dillon',33,30,'Running',30.38,0,0,0.0,0,0.0),
  ('Cody Ware',35,31,'Running',32.17,0,0,0.0,0,3.38),
  ('Austin Hill',26,32,'Running',32.37,0,0,0.0,0,0.38),
  ('BJ McLeod',39,33,'Running',34.41,0,0,0.0,0,0.76),
  ('Ty Gibbs',14,34,'Running',31.3,14,0,0.0,7,15.44),
  ('John Hunter Nemechek',29,35,'Running',31.84,1,0,0.0,0,0.77),
  ('Gray Gaulding',38,36,'Accident',35.95,0,0,0.0,0,0.0),
  ('Bubba Wallace',8,37,'Accident',4.82,7,11,14.47,12,98.68),
  ('Alex Bowman',16,38,'Accident',9.81,0,0,0.0,27,96.05),
  ('William Byron',6,39,'Accident',6.45,7,0,0.0,15,98.68)
) as x(name, st, fin, status, arp, fl, led, pled, qp, t15)
join drivers d on d.name = x.name
join races r on r.chase_round = 6;

insert into model_scores (race_id, model_type, cv_mae, cv_r2, mae, rmse, r2, top5_hits, top10_hits, predicted_winner, predicted_winner_actual_finish)
select r.id, m.* from (values
  ('basic',1.93,0.83,7.95,10.47,0.108,2,6,'Denny Hamlin',5),
  ('advanced',1.41,0.9,7.84,10.23,0.147,2,6,'Tyler Reddick',8)
) as m(model_type, cv_mae, cv_r2, mae, rmse, r2, top5_hits, top10_hits, predicted_winner, predicted_winner_actual_finish)
join races r on r.chase_round = 6;

select (select count(*) from results where race_id = (select id from races where chase_round = 6)) as results,
       (select count(*) from model_scores where race_id = (select id from races where chase_round = 6)) as scores;

commit;
