-- Martinsville (race 9): predictions, feature importances, actual results + model scores.
-- Predictions made after the race from pre-race data only (fall Martinsville excluded from all inputs);
-- results were added only after both models were logged. Safe to re-run.
begin;

update races set status = 'completed', winner = 'William Byron', blend_note = '60% short-track season form / 40% Martinsville history since 2022 (incl. spring 2026)' where chase_round = 9;

delete from predictions where race_id = (select id from races where chase_round = 9);
delete from feature_importances where race_id = (select id from races where chase_round = 9);
delete from results where race_id = (select id from races where chase_round = 9);
delete from model_scores where race_id = (select id from races where chase_round = 9);

insert into predictions (race_id, driver_id, model_type, projected_finish, data_source)
select r.id, d.id, p.model, p.proj, p.src
from (values
  ('Joey Logano','basic',8.4,'Martinsville Chase History + Short-Track Form'),
  ('Denny Hamlin','basic',8.4,'Martinsville Chase History + Short-Track Form'),
  ('Kyle Larson','basic',8.9,'Martinsville Chase History + Short-Track Form'),
  ('Ryan Blaney','basic',9.2,'Martinsville Chase History + Short-Track Form'),
  ('Christopher Bell','basic',9.6,'Martinsville Chase History + Short-Track Form'),
  ('Ty Gibbs','basic',12.9,'Martinsville Chase History + Short-Track Form'),
  ('William Byron','basic',13.6,'Martinsville Chase History + Short-Track Form'),
  ('Ryan Preece','basic',13.8,'Martinsville Chase History + Short-Track Form'),
  ('Bubba Wallace','basic',13.9,'Martinsville Chase History + Short-Track Form'),
  ('Ross Chastain','basic',14.3,'Martinsville Chase History + Short-Track Form'),
  ('Chase Briscoe','basic',14.3,'Martinsville Chase History + Short-Track Form'),
  ('Chase Elliott','basic',14.4,'Martinsville Chase History + Short-Track Form'),
  ('Josh Berry','basic',14.6,'Martinsville Chase History + Short-Track Form'),
  ('Tyler Reddick','basic',15.9,'Martinsville Chase History + Short-Track Form'),
  ('Todd Gilliland','basic',17.4,'Martinsville Chase History + Short-Track Form'),
  ('Austin Cindric','basic',17.6,'Martinsville Chase History + Short-Track Form'),
  ('Shane Van Gisbergen','basic',17.8,'Martinsville Chase History + Short-Track Form'),
  ('Daniel Suarez','basic',18.1,'Martinsville Chase History + Short-Track Form'),
  ('Brad Keselowski','basic',18.3,'Martinsville Chase History + Short-Track Form'),
  ('Chris Buescher','basic',18.3,'Martinsville Chase History + Short-Track Form'),
  ('Carson Hocevar','basic',18.4,'Martinsville Chase History + Short-Track Form'),
  ('Alex Bowman','basic',22.5,'Martinsville Chase History + Short-Track Form'),
  ('Michael McDowell','basic',22.6,'Martinsville Chase History + Short-Track Form'),
  ('Austin Dillon','basic',22.8,'Martinsville Chase History + Short-Track Form'),
  ('Zane Smith','basic',23.4,'Martinsville Chase History + Short-Track Form'),
  ('Noah Gragson','basic',24.1,'Martinsville Chase History + Short-Track Form'),
  ('Erik Jones','basic',24.5,'Martinsville Chase History + Short-Track Form'),
  ('Ricky Stenhouse Jr.','basic',24.7,'Martinsville Chase History + Short-Track Form'),
  ('Connor Zilisch','basic',25.2,'Martinsville Chase History + Short-Track Form'),
  ('Cole Custer','basic',25.2,'Martinsville Chase History + Short-Track Form'),
  ('AJ Allmendinger','basic',25.5,'Martinsville Chase History + Short-Track Form'),
  ('John Hunter Nemechek','basic',26.7,'Martinsville Chase History + Short-Track Form'),
  ('Riley Herbst','basic',27.8,'Martinsville Chase History + Short-Track Form'),
  ('Ty Dillon','basic',30.0,'Martinsville Chase History + Short-Track Form'),
  ('Austin Hill','basic',30.0,'Martinsville Chase History + Short-Track Form'),
  ('Cody Ware','basic',31.2,'Martinsville Chase History + Short-Track Form'),
  ('Josh Bilicki','basic',32.5,'Martinsville Chase History + Short-Track Form'),
  ('Ryan Blaney','advanced',7.9,'Martinsville Chase History + Short-Track Form'),
  ('Joey Logano','advanced',8.1,'Martinsville Chase History + Short-Track Form'),
  ('Denny Hamlin','advanced',8.3,'Martinsville Chase History + Short-Track Form'),
  ('Christopher Bell','advanced',10.0,'Martinsville Chase History + Short-Track Form'),
  ('Kyle Larson','advanced',10.1,'Martinsville Chase History + Short-Track Form'),
  ('Bubba Wallace','advanced',10.3,'Martinsville Chase History + Short-Track Form'),
  ('Ty Gibbs','advanced',11.3,'Martinsville Chase History + Short-Track Form'),
  ('Ryan Preece','advanced',12.1,'Martinsville Chase History + Short-Track Form'),
  ('Chase Elliott','advanced',13.1,'Martinsville Chase History + Short-Track Form'),
  ('Chase Briscoe','advanced',13.8,'Martinsville Chase History + Short-Track Form'),
  ('William Byron','advanced',13.8,'Martinsville Chase History + Short-Track Form'),
  ('Josh Berry','advanced',15.9,'Martinsville Chase History + Short-Track Form'),
  ('Ross Chastain','advanced',16.0,'Martinsville Chase History + Short-Track Form'),
  ('Todd Gilliland','advanced',16.1,'Martinsville Chase History + Short-Track Form'),
  ('Austin Cindric','advanced',16.3,'Martinsville Chase History + Short-Track Form'),
  ('Tyler Reddick','advanced',16.3,'Martinsville Chase History + Short-Track Form'),
  ('Daniel Suarez','advanced',16.4,'Martinsville Chase History + Short-Track Form'),
  ('Brad Keselowski','advanced',16.8,'Martinsville Chase History + Short-Track Form'),
  ('Carson Hocevar','advanced',17.0,'Martinsville Chase History + Short-Track Form'),
  ('Shane Van Gisbergen','advanced',17.2,'Martinsville Chase History + Short-Track Form'),
  ('Alex Bowman','advanced',17.6,'Martinsville Chase History + Short-Track Form'),
  ('Chris Buescher','advanced',18.5,'Martinsville Chase History + Short-Track Form'),
  ('Austin Dillon','advanced',18.8,'Martinsville Chase History + Short-Track Form'),
  ('Noah Gragson','advanced',22.6,'Martinsville Chase History + Short-Track Form'),
  ('Zane Smith','advanced',22.9,'Martinsville Chase History + Short-Track Form'),
  ('AJ Allmendinger','advanced',23.4,'Martinsville Chase History + Short-Track Form'),
  ('Michael McDowell','advanced',23.5,'Martinsville Chase History + Short-Track Form'),
  ('Erik Jones','advanced',23.7,'Martinsville Chase History + Short-Track Form'),
  ('Cole Custer','advanced',24.2,'Martinsville Chase History + Short-Track Form'),
  ('Ricky Stenhouse Jr.','advanced',25.0,'Martinsville Chase History + Short-Track Form'),
  ('Ty Dillon','advanced',25.4,'Martinsville Chase History + Short-Track Form'),
  ('Riley Herbst','advanced',25.8,'Martinsville Chase History + Short-Track Form'),
  ('Connor Zilisch','advanced',26.2,'Martinsville Chase History + Short-Track Form'),
  ('John Hunter Nemechek','advanced',28.2,'Martinsville Chase History + Short-Track Form'),
  ('Austin Hill','advanced',28.3,'Martinsville Chase History + Short-Track Form'),
  ('Cody Ware','advanced',32.0,'Martinsville Chase History + Short-Track Form'),
  ('Josh Bilicki','advanced',32.7,'Martinsville Chase History + Short-Track Form')
) as p(name, model, proj, src)
join drivers d on d.name = p.name
join races r on r.chase_round = 9;

insert into feature_importances (race_id, model_type, feature, importance)
select r.id, f.model, f.feature, f.imp
from (values
  ('basic','Succ%',0.605),
  ('basic','T10%',0.246),
  ('basic','ASP',0.126),
  ('basic','Fin%',0.023),
  ('basic','W%',0.0),
  ('advanced','wARP',0.733),
  ('advanced','Avg. PFAE',0.111),
  ('advanced','cPOMS',0.077),
  ('advanced','SS',0.059),
  ('advanced','PGAE',0.02)
) as f(model, feature, imp)
join races r on r.chase_round = 9;

insert into results (race_id, driver_id, start_pos, finish_pos, status, avg_running_position, fastest_laps, laps_led, pct_led, quality_passes, pct_top15)
select r.id, d.id, x.st, x.fin, x.status, x.arp, x.fl, x.led, x.pled, x.qp, x.t15
from (values
  ('William Byron',8,1,'Running',2.54,57,362,72.4,28,98.8),
  ('Chase Elliott',9,2,'Running',4.86,14,0,0.0,54,97.6),
  ('Ty Gibbs',2,3,'Running',3.64,34,44,8.8,41,100.0),
  ('Josh Berry',10,4,'Running',8.14,13,0,0.0,63,95.2),
  ('Shane Van Gisbergen',29,5,'Running',15.44,5,0,0.0,38,55.8),
  ('Denny Hamlin',1,6,'Running',8.82,16,40,8.0,50,94.0),
  ('Austin Dillon',20,7,'Running',13.16,15,0,0.0,61,70.0),
  ('Bubba Wallace',15,8,'Running',9.94,6,0,0.0,51,79.56),
  ('Kyle Larson',3,9,'Running',11.67,13,0,0.0,46,76.35),
  ('Christopher Bell',14,10,'Running',8.61,23,0,0.0,55,95.99),
  ('Ross Chastain',16,11,'Running',8.62,15,7,1.4,52,95.39),
  ('Tyler Reddick',12,12,'Running',11.95,3,0,0.0,69,92.99),
  ('Alex Bowman',7,13,'Running',10.62,7,0,0.0,54,93.99),
  ('Chase Briscoe',11,14,'Running',15.57,28,6,1.2,48,23.65),
  ('Todd Gilliland',22,15,'Running',14.05,1,0,0.0,37,72.14),
  ('Michael McDowell',26,16,'Running',18.68,6,0,0.0,21,5.61),
  ('Connor Zilisch',19,17,'Running',21.51,0,0,0.0,19,22.24),
  ('Joey Logano',5,18,'Running',10.57,17,0,0.0,38,67.47),
  ('Zane Smith',33,19,'Running',22.39,1,0,0.0,0,0.0),
  ('Austin Hill',17,20,'Running',19.06,2,0,0.0,17,9.84),
  ('Carson Hocevar',25,21,'Running',24.72,9,0,0.0,5,0.0),
  ('Ty Dillon',28,22,'Running',25.34,1,0,0.0,7,1.2),
  ('Ryan Preece',6,23,'Running',14.12,26,41,8.23,27,52.01),
  ('Chris Buescher',18,24,'Running',23.16,72,0,0.0,5,9.26),
  ('AJ Allmendinger',32,25,'Running',26.85,0,0,0.0,0,0.0),
  ('Noah Gragson',31,26,'Running',27.23,0,0,0.0,0,0.0),
  ('Brad Keselowski',23,27,'Running',25.68,0,0,0.0,8,5.43),
  ('Daniel Suarez',24,28,'Running',22.23,7,0,0.0,13,5.03),
  ('Erik Jones',30,29,'Running',29.59,24,0,0.0,4,1.41),
  ('Ricky Stenhouse Jr.',34,30,'Running',30.4,1,0,0.0,0,0.0),
  ('John Hunter Nemechek',35,31,'Running',31.81,0,0,0.0,7,2.42),
  ('Riley Herbst',27,32,'Running',29.97,3,0,0.0,4,0.81),
  ('Cody Ware',37,33,'Running',33.57,1,0,0.0,0,0.0),
  ('Cole Custer',21,34,'Running',31.46,12,0,0.0,2,0.82),
  ('Ryan Blaney',13,35,'Running',23.02,9,0,0.0,33,46.26),
  ('Austin Cindric',4,36,'Accident',10.28,4,0,0.0,21,81.53),
  ('Josh Bilicki',36,37,'Clutch',36.52,0,0,0.0,0,0.0)
) as x(name, st, fin, status, arp, fl, led, pled, qp, t15)
join drivers d on d.name = x.name
join races r on r.chase_round = 9;

insert into model_scores (race_id, model_type, cv_mae, cv_r2, mae, rmse, r2, top5_hits, top10_hits, predicted_winner, predicted_winner_actual_finish)
select r.id, m.* from (values
  ('basic',2.15,0.87,7.17,8.97,0.294,0,6,'Joey Logano',18),
  ('advanced',2.03,0.83,7.02,8.93,0.3,0,6,'Ryan Blaney',35)
) as m(model_type, cv_mae, cv_r2, mae, rmse, r2, top5_hits, top10_hits, predicted_winner, predicted_winner_actual_finish)
join races r on r.chase_round = 9;

select (select count(*) from predictions where race_id = (select id from races where chase_round = 9)) as predictions,
       (select count(*) from feature_importances where race_id = (select id from races where chase_round = 9)) as importances,
       (select count(*) from results where race_id = (select id from races where chase_round = 9)) as results,
       (select count(*) from model_scores where race_id = (select id from races where chase_round = 9)) as scores;

commit;
