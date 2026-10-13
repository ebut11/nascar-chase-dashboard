-- Post-Charlotte standings: round 6 'after' = real result; rounds 7-10 carry it forward. Safe to re-run.
begin;

delete from chase_standings where race_id = (select id from races where chase_round = 6) and phase = 'after';
delete from chase_standings where race_id in (select id from races where chase_round between 7 and 10);

with s(name, pts, rk) as (values
  ('Kyle Larson', 2367, 1),
  ('Denny Hamlin', 2318, 2),
  ('Christopher Bell', 2316, 3),
  ('Chase Briscoe', 2302, 4),
  ('Ryan Blaney', 2282, 5),
  ('Joey Logano', 2275, 6),
  ('Tyler Reddick', 2253, 7),
  ('Austin Cindric', 2222, 8),
  ('Ty Gibbs', 2211, 9),
  ('Carson Hocevar', 2187, 10),
  ('Bubba Wallace', 2182, 11),
  ('Chase Elliott', 2182, 12),
  ('William Byron', 2159, 13),
  ('Daniel Suarez', 2152, 14),
  ('Chris Buescher', 2151, 15),
  ('Ryan Preece', 2140, 16)
),
slots(chase_round, phase) as (
  select 6, 'after'
  union all
  select r, p from generate_series(7, 10) r, (values ('before'), ('after')) v(p)
)
insert into chase_standings (race_id, driver_id, phase, playoff_points, behind_leader, rank)
select ra.id, d.id, sl.phase, s.pts, 2367 - s.pts, s.rk
from s
join drivers d on d.name = s.name
cross join slots sl
join races ra on ra.chase_round = sl.chase_round;

select count(*) as inserted_rows from chase_standings
where race_id in (select id from races where chase_round between 6 and 10)
  and not (race_id = (select id from races where chase_round = 6) and phase = 'before');

commit;
