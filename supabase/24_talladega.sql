-- Talladega (race 8) pre-race predictions + feature importances. Safe to re-run.
begin;

insert into drivers (name, car_number, is_chase_driver) values
  ('Joey Gase', 44, false),
  ('Daniel Dye', 78, false),
  ('Casey Mears', null, false)
on conflict (name) do nothing;

update races set blend_note = '60% 2026 drafting form (Daytona x2, Atlanta x2, Talladega spring) / 40% Talladega history since 2022 (incl. spring 2026)' where chase_round = 8;

delete from predictions where race_id = (select id from races where chase_round = 8);
delete from feature_importances where race_id = (select id from races where chase_round = 8);

insert into predictions (race_id, driver_id, model_type, projected_finish, data_source)
select r.id, d.id, p.model, p.proj, p.src
from (values
  ('Chase Elliott','basic',12.7,'Talladega Chase History + Drafting Form'),
  ('Tyler Reddick','basic',13.2,'Talladega Chase History + Drafting Form'),
  ('Daniel Suarez','basic',14.4,'Talladega Chase History + Drafting Form'),
  ('Chris Buescher','basic',15.2,'Talladega Chase History + Drafting Form'),
  ('Ross Chastain','basic',16.1,'Talladega Chase History + Drafting Form'),
  ('Austin Cindric','basic',16.1,'Talladega Chase History + Drafting Form'),
  ('Carson Hocevar','basic',16.7,'Talladega Chase History + Drafting Form'),
  ('Brad Keselowski','basic',17.9,'Talladega Chase History + Drafting Form'),
  ('Ricky Stenhouse Jr.','basic',18.1,'Talladega Chase History + Drafting Form'),
  ('Chase Briscoe','basic',18.1,'Talladega Chase History + Drafting Form'),
  ('Alex Bowman','basic',18.2,'Talladega Chase History + Drafting Form'),
  ('Zane Smith','basic',18.7,'Talladega Chase History + Drafting Form'),
  ('Shane Van Gisbergen','basic',18.8,'Talladega Chase History + Drafting Form'),
  ('Christopher Bell','basic',18.9,'Talladega Chase History + Drafting Form'),
  ('Bubba Wallace','basic',18.9,'Talladega Chase History + Drafting Form'),
  ('Ryan Preece','basic',19.3,'Talladega Chase History + Drafting Form'),
  ('Michael McDowell','basic',19.4,'Talladega Chase History + Drafting Form'),
  ('Denny Hamlin','basic',19.4,'Talladega Chase History + Drafting Form'),
  ('Ryan Blaney','basic',19.4,'Talladega Chase History + Drafting Form'),
  ('Ty Dillon','basic',19.5,'Talladega Chase History + Drafting Form'),
  ('Austin Dillon','basic',19.7,'Talladega Chase History + Drafting Form'),
  ('William Byron','basic',19.7,'Talladega Chase History + Drafting Form'),
  ('Todd Gilliland','basic',19.7,'Talladega Chase History + Drafting Form'),
  ('Austin Hill','basic',19.8,'Talladega Chase History + Drafting Form'),
  ('Cole Custer','basic',20.6,'Talladega Chase History + Drafting Form'),
  ('Noah Gragson','basic',20.7,'Talladega Chase History + Drafting Form'),
  ('Erik Jones','basic',20.8,'Talladega Chase History + Drafting Form'),
  ('John Hunter Nemechek','basic',21.4,'Talladega Chase History + Drafting Form'),
  ('Casey Mears','basic',21.9,'Talladega Chase History + Drafting Form'),
  ('Riley Herbst','basic',22.3,'Talladega Chase History + Drafting Form'),
  ('AJ Allmendinger','basic',22.4,'Talladega Chase History + Drafting Form'),
  ('Joey Logano','basic',22.6,'Talladega Chase History + Drafting Form'),
  ('Josh Berry','basic',22.9,'Talladega Chase History + Drafting Form'),
  ('Kyle Larson','basic',23.5,'Talladega Chase History + Drafting Form'),
  ('Cody Ware','basic',23.7,'Talladega Chase History + Drafting Form'),
  ('Ty Gibbs','basic',24.1,'Talladega Chase History + Drafting Form'),
  ('Connor Zilisch','basic',30.4,'Talladega Chase History + Drafting Form'),
  ('Daniel Dye','basic',31.3,'Talladega Chase History + Drafting Form'),
  ('Joey Gase','basic',31.3,'Talladega Chase History + Drafting Form'),
  ('Tyler Reddick','advanced',11.4,'Talladega Chase History + Drafting Form'),
  ('Chase Elliott','advanced',12.1,'Talladega Chase History + Drafting Form'),
  ('Ricky Stenhouse Jr.','advanced',13.1,'Talladega Chase History + Drafting Form'),
  ('Carson Hocevar','advanced',13.2,'Talladega Chase History + Drafting Form'),
  ('Ross Chastain','advanced',13.4,'Talladega Chase History + Drafting Form'),
  ('Daniel Suarez','advanced',13.6,'Talladega Chase History + Drafting Form'),
  ('Alex Bowman','advanced',14.6,'Talladega Chase History + Drafting Form'),
  ('Noah Gragson','advanced',14.7,'Talladega Chase History + Drafting Form'),
  ('Zane Smith','advanced',15.3,'Talladega Chase History + Drafting Form'),
  ('Ty Dillon','advanced',15.8,'Talladega Chase History + Drafting Form'),
  ('Todd Gilliland','advanced',16.0,'Talladega Chase History + Drafting Form'),
  ('Denny Hamlin','advanced',16.6,'Talladega Chase History + Drafting Form'),
  ('Shane Van Gisbergen','advanced',17.8,'Talladega Chase History + Drafting Form'),
  ('Austin Cindric','advanced',19.3,'Talladega Chase History + Drafting Form'),
  ('Christopher Bell','advanced',19.4,'Talladega Chase History + Drafting Form'),
  ('William Byron','advanced',19.4,'Talladega Chase History + Drafting Form'),
  ('Chris Buescher','advanced',19.7,'Talladega Chase History + Drafting Form'),
  ('Brad Keselowski','advanced',20.0,'Talladega Chase History + Drafting Form'),
  ('Erik Jones','advanced',20.0,'Talladega Chase History + Drafting Form'),
  ('Ryan Preece','advanced',20.1,'Talladega Chase History + Drafting Form'),
  ('Austin Dillon','advanced',20.2,'Talladega Chase History + Drafting Form'),
  ('Michael McDowell','advanced',20.2,'Talladega Chase History + Drafting Form'),
  ('Cole Custer','advanced',20.3,'Talladega Chase History + Drafting Form'),
  ('John Hunter Nemechek','advanced',20.8,'Talladega Chase History + Drafting Form'),
  ('Bubba Wallace','advanced',20.9,'Talladega Chase History + Drafting Form'),
  ('AJ Allmendinger','advanced',22.4,'Talladega Chase History + Drafting Form'),
  ('Chase Briscoe','advanced',22.4,'Talladega Chase History + Drafting Form'),
  ('Ryan Blaney','advanced',22.4,'Talladega Chase History + Drafting Form'),
  ('Cody Ware','advanced',24.3,'Talladega Chase History + Drafting Form'),
  ('Daniel Dye','advanced',24.8,'Talladega Chase History + Drafting Form'),
  ('Riley Herbst','advanced',24.9,'Talladega Chase History + Drafting Form'),
  ('Connor Zilisch','advanced',25.7,'Talladega Chase History + Drafting Form'),
  ('Austin Hill','advanced',26.6,'Talladega Chase History + Drafting Form'),
  ('Joey Logano','advanced',26.7,'Talladega Chase History + Drafting Form'),
  ('Josh Berry','advanced',26.7,'Talladega Chase History + Drafting Form'),
  ('Ty Gibbs','advanced',26.9,'Talladega Chase History + Drafting Form'),
  ('Joey Gase','advanced',29.5,'Talladega Chase History + Drafting Form'),
  ('Casey Mears','advanced',29.7,'Talladega Chase History + Drafting Form'),
  ('Kyle Larson','advanced',30.3,'Talladega Chase History + Drafting Form')
) as p(name, model, proj, src)
join drivers d on d.name = p.name
join races r on r.chase_round = 8;

insert into feature_importances (race_id, model_type, feature, importance)
select r.id, f.model, f.feature, f.imp
from (values
  ('basic','Succ%',0.726),
  ('basic','ASP',0.12),
  ('basic','T10%',0.091),
  ('basic','Fin%',0.062),
  ('basic','W%',0.001),
  ('advanced','Avg. PFAE',0.852),
  ('advanced','cPOMS',0.081),
  ('advanced','wARP',0.047),
  ('advanced','SS',0.013),
  ('advanced','PGAE',0.007)
) as f(model, feature, imp)
join races r on r.chase_round = 8;

select (select count(*) from predictions where race_id = (select id from races where chase_round = 8)) as predictions,
       (select count(*) from feature_importances where race_id = (select id from races where chase_round = 8)) as importances;

commit;
