-- Post-Las Vegas standings: round 5 'after' = real result; rounds 6-10 carry it forward.
-- Safe to re-run.
begin;

delete from chase_standings where race_id = (select id from races where chase_round = 5) and phase = 'after';
delete from chase_standings where race_id in (select id from races where chase_round between 6 and 10);

with s(name, pts, rk) as (values
  ('Kyle Larson', 2318, 1),
  ('Denny Hamlin', 2278, 2),
  ('Christopher Bell', 2263, 3),
  ('Joey Logano', 2247, 4),
  ('Ryan Blaney', 2238, 5),
  ('Chase Briscoe', 2234, 6),
  ('Tyler Reddick', 2212, 7),
  ('Ty Gibbs', 2208, 8),
  ('Austin Cindric', 2190, 9),
  ('Bubba Wallace', 2181, 10),
  ('Carson Hocevar', 2160, 11),
  ('William Byron', 2158, 12),
  ('Chase Elliott', 2155, 13),
  ('Daniel Suarez', 2123, 14),
  ('Chris Buescher', 2122, 15),
  ('Ryan Preece', 2118, 16)
),
slots(chase_round, phase) as (
  select 5, 'after'
  union all
  select r, p from generate_series(6, 10) r, (values ('before'), ('after')) v(p)
)
insert into chase_standings (race_id, driver_id, phase, playoff_points, behind_leader, rank)
select ra.id, d.id, sl.phase, s.pts, 2318 - s.pts, s.rk
from s
join drivers d on d.name = s.name
cross join slots sl
join races ra on ra.chase_round = sl.chase_round;

select count(*) as inserted_rows from chase_standings
where race_id in (select id from races where chase_round between 5 and 10) and not (race_id = (select id from races where chase_round = 5) and phase = 'before');

commit;
