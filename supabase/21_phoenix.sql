-- Phoenix (race 7) pre-race predictions + feature importances. Safe to re-run.
begin;

update races set blend_note = '60% flat-mile season form (Gateway/Phoenix/NH/Nashville/Richmond/Iowa) / 40% Phoenix history since 2022 (incl. spring 2026)' where chase_round = 7;

delete from predictions where race_id = (select id from races where chase_round = 7);
delete from feature_importances where race_id = (select id from races where chase_round = 7);

insert into predictions (race_id, driver_id, model_type, projected_finish, data_source)
select r.id, d.id, p.model, p.proj, p.src
from (values
  ('Kyle Larson','basic',9.6,'Phoenix Chase History + Flat-Mile Form'),
  ('Denny Hamlin','basic',9.6,'Phoenix Chase History + Flat-Mile Form'),
  ('Christopher Bell','basic',9.6,'Phoenix Chase History + Flat-Mile Form'),
  ('Ryan Blaney','basic',10.9,'Phoenix Chase History + Flat-Mile Form'),
  ('Joey Logano','basic',11.9,'Phoenix Chase History + Flat-Mile Form'),
  ('William Byron','basic',12.2,'Phoenix Chase History + Flat-Mile Form'),
  ('Tyler Reddick','basic',14.8,'Phoenix Chase History + Flat-Mile Form'),
  ('Ty Gibbs','basic',15.4,'Phoenix Chase History + Flat-Mile Form'),
  ('Josh Berry','basic',17.1,'Phoenix Chase History + Flat-Mile Form'),
  ('Bubba Wallace','basic',17.5,'Phoenix Chase History + Flat-Mile Form'),
  ('Alex Bowman','basic',17.5,'Phoenix Chase History + Flat-Mile Form'),
  ('Michael McDowell','basic',17.8,'Phoenix Chase History + Flat-Mile Form'),
  ('Ryan Preece','basic',18.1,'Phoenix Chase History + Flat-Mile Form'),
  ('Austin Dillon','basic',18.1,'Phoenix Chase History + Flat-Mile Form'),
  ('Ross Chastain','basic',18.2,'Phoenix Chase History + Flat-Mile Form'),
  ('Chris Buescher','basic',18.2,'Phoenix Chase History + Flat-Mile Form'),
  ('Austin Hill','basic',18.4,'Phoenix Chase History + Flat-Mile Form'),
  ('Chase Briscoe','basic',19.1,'Phoenix Chase History + Flat-Mile Form'),
  ('Chase Elliott','basic',19.4,'Phoenix Chase History + Flat-Mile Form'),
  ('Carson Hocevar','basic',20.0,'Phoenix Chase History + Flat-Mile Form'),
  ('Riley Herbst','basic',20.9,'Phoenix Chase History + Flat-Mile Form'),
  ('Todd Gilliland','basic',21.0,'Phoenix Chase History + Flat-Mile Form'),
  ('Austin Cindric','basic',21.6,'Phoenix Chase History + Flat-Mile Form'),
  ('Erik Jones','basic',21.6,'Phoenix Chase History + Flat-Mile Form'),
  ('Daniel Suarez','basic',21.7,'Phoenix Chase History + Flat-Mile Form'),
  ('Brad Keselowski','basic',21.8,'Phoenix Chase History + Flat-Mile Form'),
  ('Shane Van Gisbergen','basic',21.9,'Phoenix Chase History + Flat-Mile Form'),
  ('AJ Allmendinger','basic',21.9,'Phoenix Chase History + Flat-Mile Form'),
  ('Ricky Stenhouse Jr.','basic',22.3,'Phoenix Chase History + Flat-Mile Form'),
  ('Noah Gragson','basic',22.8,'Phoenix Chase History + Flat-Mile Form'),
  ('Zane Smith','basic',23.5,'Phoenix Chase History + Flat-Mile Form'),
  ('John Hunter Nemechek','basic',23.7,'Phoenix Chase History + Flat-Mile Form'),
  ('Connor Zilisch','basic',24.0,'Phoenix Chase History + Flat-Mile Form'),
  ('Cole Custer','basic',24.4,'Phoenix Chase History + Flat-Mile Form'),
  ('Corey Heim','basic',24.8,'Flat-Mile Form Only (no Phoenix history)'),
  ('Ty Dillon','basic',27.8,'Phoenix Chase History + Flat-Mile Form'),
  ('Cody Ware','basic',28.4,'Phoenix Chase History + Flat-Mile Form'),
  ('Ryan Blaney','advanced',9.6,'Phoenix Chase History + Flat-Mile Form'),
  ('Christopher Bell','advanced',9.6,'Phoenix Chase History + Flat-Mile Form'),
  ('Denny Hamlin','advanced',10.7,'Phoenix Chase History + Flat-Mile Form'),
  ('Kyle Larson','advanced',11.7,'Phoenix Chase History + Flat-Mile Form'),
  ('Joey Logano','advanced',12.4,'Phoenix Chase History + Flat-Mile Form'),
  ('William Byron','advanced',13.1,'Phoenix Chase History + Flat-Mile Form'),
  ('Ty Gibbs','advanced',14.4,'Phoenix Chase History + Flat-Mile Form'),
  ('Tyler Reddick','advanced',14.8,'Phoenix Chase History + Flat-Mile Form'),
  ('Chase Briscoe','advanced',15.6,'Phoenix Chase History + Flat-Mile Form'),
  ('Chase Elliott','advanced',16.3,'Phoenix Chase History + Flat-Mile Form'),
  ('Bubba Wallace','advanced',16.6,'Phoenix Chase History + Flat-Mile Form'),
  ('Josh Berry','advanced',16.7,'Phoenix Chase History + Flat-Mile Form'),
  ('Austin Dillon','advanced',17.0,'Phoenix Chase History + Flat-Mile Form'),
  ('Chris Buescher','advanced',17.1,'Phoenix Chase History + Flat-Mile Form'),
  ('Ryan Preece','advanced',17.2,'Phoenix Chase History + Flat-Mile Form'),
  ('Ross Chastain','advanced',17.5,'Phoenix Chase History + Flat-Mile Form'),
  ('Alex Bowman','advanced',17.7,'Phoenix Chase History + Flat-Mile Form'),
  ('Michael McDowell','advanced',17.8,'Phoenix Chase History + Flat-Mile Form'),
  ('Shane Van Gisbergen','advanced',17.8,'Phoenix Chase History + Flat-Mile Form'),
  ('Todd Gilliland','advanced',18.6,'Phoenix Chase History + Flat-Mile Form'),
  ('Brad Keselowski','advanced',20.4,'Phoenix Chase History + Flat-Mile Form'),
  ('Austin Cindric','advanced',21.2,'Phoenix Chase History + Flat-Mile Form'),
  ('Noah Gragson','advanced',21.3,'Phoenix Chase History + Flat-Mile Form'),
  ('Daniel Suarez','advanced',21.8,'Phoenix Chase History + Flat-Mile Form'),
  ('Erik Jones','advanced',21.8,'Phoenix Chase History + Flat-Mile Form'),
  ('AJ Allmendinger','advanced',22.3,'Phoenix Chase History + Flat-Mile Form'),
  ('Cole Custer','advanced',22.6,'Phoenix Chase History + Flat-Mile Form'),
  ('Ricky Stenhouse Jr.','advanced',22.9,'Phoenix Chase History + Flat-Mile Form'),
  ('Carson Hocevar','advanced',23.1,'Phoenix Chase History + Flat-Mile Form'),
  ('Riley Herbst','advanced',23.6,'Phoenix Chase History + Flat-Mile Form'),
  ('John Hunter Nemechek','advanced',23.7,'Phoenix Chase History + Flat-Mile Form'),
  ('Zane Smith','advanced',24.4,'Phoenix Chase History + Flat-Mile Form'),
  ('Connor Zilisch','advanced',24.4,'Phoenix Chase History + Flat-Mile Form'),
  ('Ty Dillon','advanced',25.1,'Phoenix Chase History + Flat-Mile Form'),
  ('Corey Heim','advanced',25.4,'Flat-Mile Form Only (no Phoenix history)'),
  ('Austin Hill','advanced',26.3,'Phoenix Chase History + Flat-Mile Form'),
  ('Cody Ware','advanced',28.3,'Phoenix Chase History + Flat-Mile Form')
) as p(name, model, proj, src)
join drivers d on d.name = p.name
join races r on r.chase_round = 7;

insert into feature_importances (race_id, model_type, feature, importance)
select r.id, f.model, f.feature, f.imp
from (values
  ('basic','ASP',0.426),
  ('basic','Succ%',0.423),
  ('basic','T10%',0.101),
  ('basic','W%',0.035),
  ('basic','Fin%',0.014),
  ('advanced','Avg. PFAE',0.63),
  ('advanced','SS',0.17),
  ('advanced','wARP',0.075),
  ('advanced','cPOMS',0.072),
  ('advanced','PGAE',0.053)
) as f(model, feature, imp)
join races r on r.chase_round = 7;

select (select count(*) from predictions where race_id = (select id from races where chase_round = 7)) as predictions,
       (select count(*) from feature_importances where race_id = (select id from races where chase_round = 7)) as importances;

commit;
