-- Post-Talladega standings: round 8 'after' = real result; rounds 9-10 carry it forward. Safe to re-run.
begin;

delete from chase_standings where race_id = (select id from races where chase_round = 8) and phase = 'after';
delete from chase_standings where race_id in (select id from races where chase_round between 9 and 10);

with s(name, pts, rk) as (values
  ('Kyle Larson', 2441, 1),
  ('Denny Hamlin', 2368, 2),
  ('Christopher Bell', 2367, 3),
  ('Chase Briscoe', 2362, 4),
  ('Joey Logano', 2341, 5),
  ('Ryan Blaney', 2334, 6),
  ('Tyler Reddick', 2315, 7),
  ('Austin Cindric', 2258, 8),
  ('Ty Gibbs', 2258, 9),
  ('Carson Hocevar', 2243, 10),
  ('William Byron', 2227, 11),
  ('Chase Elliott', 2223, 12),
  ('Bubba Wallace', 2223, 13),
  ('Daniel Suarez', 2201, 14),
  ('Ryan Preece', 2192, 15),
  ('Chris Buescher', 2186, 16)
),
slots(chase_round, phase) as (
  select 8, 'after'
  union all
  select r, p from generate_series(9, 10) r, (values ('before'), ('after')) v(p)
)
insert into chase_standings (race_id, driver_id, phase, playoff_points, behind_leader, rank)
select ra.id, d.id, sl.phase, s.pts, 2441 - s.pts, s.rk
from s
join drivers d on d.name = s.name
cross join slots sl
join races ra on ra.chase_round = sl.chase_round;

select count(*) as inserted_rows from chase_standings
where race_id in (select id from races where chase_round between 8 and 10)
  and not (race_id = (select id from races where chase_round = 8) and phase = 'before');

commit;
