-- Talladega (race 8) actual results + model scores. Safe to re-run.
begin;

update drivers set car_number = 62 where name = 'Casey Mears';
update races set status = 'completed', winner = 'Kyle Larson' where chase_round = 8;

delete from results where race_id = (select id from races where chase_round = 8);
delete from model_scores where race_id = (select id from races where chase_round = 8);

insert into results (race_id, driver_id, start_pos, finish_pos, status, avg_running_position, fastest_laps, laps_led, pct_led, quality_passes, pct_top15)
select r.id, d.id, x.st, x.fin, x.status, x.arp, x.fl, x.led, x.pled, x.qp, x.t15
from (values
  ('Kyle Larson',10,1,'Running',11.37,2,23,12.17,193,67.72),
  ('William Byron',17,2,'Running',15.52,2,0,0.0,146,53.97),
  ('Ricky Stenhouse Jr.',24,3,'Running',24.34,1,9,4.76,93,23.81),
  ('Ross Chastain',15,4,'Running',26.52,7,0,0.0,34,6.88),
  ('Cole Custer',20,5,'Running',17.84,2,0,0.0,155,33.86),
  ('Carson Hocevar',26,6,'Running',27.7,7,0,0.0,73,12.17),
  ('Todd Gilliland',35,7,'Running',18.84,5,6,3.17,153,50.26),
  ('Denny Hamlin',9,8,'Running',13.37,3,0,0.0,262,62.43),
  ('Alex Bowman',7,9,'Running',17.53,1,0,0.0,98,38.1),
  ('Michael McDowell',23,10,'Running',20.26,6,0,0.0,144,35.45),
  ('Austin Dillon',12,11,'Running',16.65,7,0,0.0,183,45.5),
  ('Josh Berry',21,12,'Running',20.08,5,8,4.23,69,33.33),
  ('Ryan Preece',19,13,'Running',7.68,9,23,12.17,137,70.9),
  ('Austin Hill',2,14,'Running',12.93,3,6,3.17,193,55.03),
  ('Ty Dillon',30,15,'Running',33.61,9,0,0.0,0,2.66),
  ('Cody Ware',11,16,'Running',24.85,5,9,4.79,83,19.15),
  ('Ty Gibbs',8,17,'Running',22.83,9,0,0.0,71,20.74),
  ('Daniel Suarez',13,18,'Running',24.92,0,0,0.0,65,13.3),
  ('Zane Smith',31,19,'Running',29.6,4,0,0.0,5,7.49),
  ('Noah Gragson',39,20,'Running',28.88,3,0,0.0,37,7.53),
  ('Joey Gase',38,21,'Running',29.35,2,0,0.0,68,17.74),
  ('Bubba Wallace',25,22,'Running',18.56,2,0,0.0,140,41.62),
  ('Gray Gaulding',40,23,'Running',27.81,2,5,2.7,53,16.76),
  ('Brad Keselowski',22,24,'Accident',6.79,8,12,6.52,187,88.04),
  ('Daniel Dye',36,25,'Running',27.65,3,1,0.54,83,20.65),
  ('Riley Herbst',14,26,'Accident',16.02,3,2,1.09,208,56.83),
  ('Austin Cindric',28,27,'Accident',12.55,1,0,0.0,241,73.77),
  ('Erik Jones',29,28,'Accident',12.98,3,6,3.28,205,69.95),
  ('Connor Zilisch',3,29,'Accident',18.23,5,0,0.0,163,39.34),
  ('Shane Van Gisbergen',4,30,'Accident',13.23,5,0,0.0,269,70.49),
  ('AJ Allmendinger',37,31,'Accident',26.44,8,0,0.0,33,8.2),
  ('Chris Buescher',5,32,'Accident',6.27,10,53,28.96,201,86.89),
  ('Chase Briscoe',1,33,'Accident',16.19,4,0,0.0,240,61.75),
  ('Joey Logano',16,34,'Accident',13.95,6,23,12.57,169,60.66),
  ('Christopher Bell',6,35,'Suspension',31.64,1,3,1.69,31,8.47),
  ('Chase Elliott',18,36,'Running',17.83,6,0,0.0,147,44.22),
  ('Tyler Reddick',33,37,'Running',18.93,2,0,0.0,102,48.18),
  ('Ryan Blaney',27,38,'Accident',16.23,0,0,0.0,115,62.6),
  ('John Hunter Nemechek',32,39,'Accident',23.85,2,0,0.0,32,7.63),
  ('Casey Mears',34,40,'Mechanical',26.66,3,0,0.0,94,32.82)
) as x(name, st, fin, status, arp, fl, led, pled, qp, t15)
join drivers d on d.name = x.name
join races r on r.chase_round = 8;

insert into model_scores (race_id, model_type, cv_mae, cv_r2, mae, rmse, r2, top5_hits, top10_hits, predicted_winner, predicted_winner_actual_finish)
select r.id, m.* from (values
  ('basic',2.94,0.73,10.81,12.39,-0.126,1,3,'Chase Elliott',36),
  ('advanced',2.46,0.79,10.06,11.96,-0.048,2,4,'Tyler Reddick',37)
) as m(model_type, cv_mae, cv_r2, mae, rmse, r2, top5_hits, top10_hits, predicted_winner, predicted_winner_actual_finish)
join races r on r.chase_round = 8;

select (select count(*) from results where race_id = (select id from races where chase_round = 8)) as results,
       (select count(*) from model_scores where race_id = (select id from races where chase_round = 8)) as scores;

commit;
