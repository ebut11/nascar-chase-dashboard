-- Standalone: adds the chase_standings table and its data.
-- Safe to run once on top of an existing 01_schema.sql + 02_seed.sql.
begin;
drop table if exists chase_standings cascade;
create table chase_standings (
  id             serial primary key,
  race_id        int  not null references races(id) on delete cascade,
  driver_id      int  not null references drivers(id) on delete cascade,
  phase          text not null check (phase in ('before','after')),
  playoff_points int,
  behind_leader  int  not null default 0,
  rank           int  not null,
  unique (race_id, driver_id, phase)
);
create index on chase_standings (race_id, phase);
alter table chase_standings enable row level security;
create policy "public read" on chase_standings for select using (true);
grant select on chase_standings to anon, authenticated;

insert into chase_standings (race_id, driver_id, phase, playoff_points, behind_leader, rank) values
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Denny Hamlin'), 'before', null, 0, 1),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Ryan Blaney'), 'before', null, 25, 2),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Tyler Reddick'), 'before', null, 35, 3),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Ty Gibbs'), 'before', null, 40, 4),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Chase Briscoe'), 'before', null, 45, 5),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Christopher Bell'), 'before', null, 50, 6),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Kyle Larson'), 'before', null, 55, 7),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Chase Elliott'), 'before', null, 60, 8),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Joey Logano'), 'before', null, 65, 9),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Chris Buescher'), 'before', null, 70, 10),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Daniel Suarez'), 'before', null, 75, 11),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Carson Hocevar'), 'before', null, 80, 12),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'William Byron'), 'before', null, 85, 13),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Bubba Wallace'), 'before', null, 90, 14),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Austin Cindric'), 'before', null, 95, 15),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Ryan Preece'), 'before', null, 100, 16),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Denny Hamlin'), 'after', 2135, 0, 1),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Christopher Bell'), 'after', 2123, 12, 2),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Ryan Blaney'), 'after', 2119, 16, 3),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Tyler Reddick'), 'after', 2111, 24, 4),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Chase Briscoe'), 'after', 2098, 37, 5),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Ty Gibbs'), 'after', 2096, 39, 6),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Kyle Larson'), 'after', 2086, 49, 7),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Joey Logano'), 'after', 2063, 72, 8),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Chase Elliott'), 'after', 2063, 72, 9),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Bubba Wallace'), 'after', 2054, 81, 10),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Chris Buescher'), 'after', 2047, 88, 11),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Carson Hocevar'), 'after', 2046, 89, 12),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Daniel Suarez'), 'after', 2041, 94, 13),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Austin Cindric'), 'after', 2033, 102, 14),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'Ryan Preece'), 'after', 2031, 104, 15),
  ((select id from races where chase_round = 1), (select id from drivers where name = 'William Byron'), 'after', 2021, 114, 16);
commit;
