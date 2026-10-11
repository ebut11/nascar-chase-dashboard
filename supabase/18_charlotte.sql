-- Charlotte (race 6) pre-race predictions + feature importances. Safe to re-run.
begin;

update races set blend_note = '60% intermediate season form / 40% Charlotte history since 2022 (incl. 2026 Coca-Cola 600)' where chase_round = 6;

delete from predictions where race_id = (select id from races where chase_round = 6);
delete from feature_importances where race_id = (select id from races where chase_round = 6);

insert into predictions (race_id, driver_id, model_type, projected_finish, data_source)
select r.id, d.id, p.model, p.proj, 'Charlotte Chase History + Intermediate Form'
from (values
  ('Denny Hamlin','basic',10.4),
  ('Tyler Reddick','basic',10.5),
  ('William Byron','basic',11.3),
  ('Christopher Bell','basic',12.9),
  ('Kyle Larson','basic',13.2),
  ('Chase Briscoe','basic',13.4),
  ('Ryan Blaney','basic',13.5),
  ('Ty Gibbs','basic',13.5),
  ('Chase Elliott','basic',13.7),
  ('Alex Bowman','basic',15.5),
  ('Joey Logano','basic',15.7),
  ('Bubba Wallace','basic',15.9),
  ('Brad Keselowski','basic',16.1),
  ('Chris Buescher','basic',16.6),
  ('Daniel Suarez','basic',17.2),
  ('Austin Cindric','basic',17.5),
  ('Carson Hocevar','basic',18.8),
  ('Ryan Preece','basic',19.2),
  ('Zane Smith','basic',19.6),
  ('Ricky Stenhouse Jr.','basic',20.4),
  ('Shane Van Gisbergen','basic',20.6),
  ('Erik Jones','basic',20.9),
  ('Michael McDowell','basic',20.9),
  ('Austin Dillon','basic',21.0),
  ('AJ Allmendinger','basic',21.5),
  ('Riley Herbst','basic',21.7),
  ('Ross Chastain','basic',22.2),
  ('Austin Hill','basic',22.6),
  ('John Hunter Nemechek','basic',23.1),
  ('Josh Berry','basic',23.4),
  ('Cole Custer','basic',23.9),
  ('Noah Gragson','basic',25.2),
  ('Todd Gilliland','basic',25.7),
  ('Ty Dillon','basic',26.7),
  ('Cody Ware','basic',27.6),
  ('Connor Zilisch','basic',27.6),
  ('Tyler Reddick','advanced',10.5),
  ('Denny Hamlin','advanced',11.1),
  ('William Byron','advanced',11.8),
  ('Kyle Larson','advanced',11.9),
  ('Christopher Bell','advanced',11.9),
  ('Chase Briscoe','advanced',12.4),
  ('Ty Gibbs','advanced',12.6),
  ('Ryan Blaney','advanced',12.7),
  ('Chase Elliott','advanced',14.7),
  ('Brad Keselowski','advanced',14.9),
  ('Alex Bowman','advanced',15.5),
  ('Joey Logano','advanced',15.7),
  ('Erik Jones','advanced',15.8),
  ('Carson Hocevar','advanced',16.4),
  ('Bubba Wallace','advanced',16.5),
  ('Daniel Suarez','advanced',17.4),
  ('Ross Chastain','advanced',17.7),
  ('Chris Buescher','advanced',17.8),
  ('Austin Cindric','advanced',18.6),
  ('Shane Van Gisbergen','advanced',19.0),
  ('AJ Allmendinger','advanced',19.8),
  ('Ryan Preece','advanced',19.9),
  ('Ricky Stenhouse Jr.','advanced',20.6),
  ('Josh Berry','advanced',21.1),
  ('Austin Dillon','advanced',21.2),
  ('Michael McDowell','advanced',21.3),
  ('Todd Gilliland','advanced',21.9),
  ('Cole Custer','advanced',22.8),
  ('Zane Smith','advanced',22.9),
  ('Riley Herbst','advanced',23.0),
  ('John Hunter Nemechek','advanced',24.9),
  ('Noah Gragson','advanced',25.0),
  ('Austin Hill','advanced',25.6),
  ('Ty Dillon','advanced',25.7),
  ('Cody Ware','advanced',26.7),
  ('Connor Zilisch','advanced',27.6)
) as p(name, model, proj)
join drivers d on d.name = p.name
join races r on r.chase_round = 6;

insert into feature_importances (race_id, model_type, feature, importance)
select r.id, f.model, f.feature, f.imp
from (values
  ('basic','T10%',0.469),
  ('basic','ASP',0.303),
  ('basic','Succ%',0.22),
  ('basic','W%',0.005),
  ('basic','Fin%',0.002),
  ('advanced','Avg. PFAE',0.287),
  ('advanced','SS',0.261),
  ('advanced','cPOMS',0.246),
  ('advanced','wARP',0.139),
  ('advanced','PGAE',0.066)
) as f(model, feature, imp)
join races r on r.chase_round = 6;

select (select count(*) from predictions where race_id = (select id from races where chase_round = 6)) as predictions,
       (select count(*) from feature_importances where race_id = (select id from races where chase_round = 6)) as importances;

commit;
