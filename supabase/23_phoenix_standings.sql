-- Post-Phoenix standings: round 7 'after' = real result; rounds 8-10 carry it forward. Safe to re-run.
begin;

delete from chase_standings where race_id = (select id from races where chase_round = 7) and phase = 'after';
delete from chase_standings where race_id in (select id from races where chase_round between 8 and 10);

with s(name, pts, rk) as (values
  ('Kyle Larson', 2370, 1),
  ('Christopher Bell', 2365, 2),
  ('Chase Briscoe', 2346, 3),
  ('Denny Hamlin', 2339, 4),
  ('Ryan Blaney', 2330, 5),
  ('Joey Logano', 2326, 6),
  ('Tyler Reddick', 2314, 7),
  ('Austin Cindric', 2240, 8),
  ('Ty Gibbs', 2238, 9),
  ('Chase Elliott', 2221, 10),
  ('Carson Hocevar', 2212, 11),
  ('Bubba Wallace', 2208, 12),
  ('Daniel Suarez', 2182, 13),
  ('William Byron', 2180, 14),
  ('Chris Buescher', 2166, 15),
  ('Ryan Preece', 2159, 16)
),
slots(chase_round, phase) as (
  select 7, 'after'
  union all
  select r, p from generate_series(8, 10) r, (values ('before'), ('after')) v(p)
)
insert into chase_standings (race_id, driver_id, phase, playoff_points, behind_leader, rank)
select ra.id, d.id, sl.phase, s.pts, 2370 - s.pts, s.rk
from s
join drivers d on d.name = s.name
cross join slots sl
join races ra on ra.chase_round = sl.chase_round;

select count(*) as inserted_rows from chase_standings
where race_id in (select id from races where chase_round between 7 and 10)
  and not (race_id = (select id from races where chase_round = 7) and phase = 'before');

commit;
