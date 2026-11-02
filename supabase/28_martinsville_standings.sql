-- Post-Martinsville standings: round 9 'after' = real result; rounds 10-10 carry it forward. Safe to re-run.
begin;

delete from chase_standings where race_id = (select id from races where chase_round = 9) and phase = 'after';
delete from chase_standings where race_id in (select id from races where chase_round between 10 and 10);

with s(name, pts, rk) as (values
  ('Kyle Larson', 2469, 1),
  ('Christopher Bell', 2402, 2),
  ('Denny Hamlin', 2399, 3),
  ('Chase Briscoe', 2385, 4),
  ('Joey Logano', 2366, 5),
  ('Tyler Reddick', 2344, 6),
  ('Ryan Blaney', 2336, 7),
  ('Ty Gibbs', 2309, 8),
  ('William Byron', 2303, 9),
  ('Chase Elliott', 2268, 10),
  ('Austin Cindric', 2263, 11),
  ('Carson Hocevar', 2259, 12),
  ('Bubba Wallace', 2257, 13),
  ('Ryan Preece', 2214, 14),
  ('Daniel Suarez', 2210, 15),
  ('Chris Buescher', 2199, 16)
),
slots(chase_round, phase) as (
  select 9, 'after'
  union all
  select r, p from generate_series(10, 10) r, (values ('before'), ('after')) v(p)
)
insert into chase_standings (race_id, driver_id, phase, playoff_points, behind_leader, rank)
select ra.id, d.id, sl.phase, s.pts, 2469 - s.pts, s.rk
from s
join drivers d on d.name = s.name
cross join slots sl
join races ra on ra.chase_round = sl.chase_round;

select count(*) as inserted_rows from chase_standings
where race_id in (select id from races where chase_round between 9 and 10)
  and not (race_id = (select id from races where chase_round = 9) and phase = 'before');

commit;
