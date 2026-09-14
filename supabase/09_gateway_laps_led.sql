-- Standalone: fill in laps_led for Gateway (round 2) results.
-- Safe to re-run.
begin;

update results set laps_led = 80 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Kyle Larson');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Alex Bowman');
update results set laps_led = 96 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Joey Logano');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'William Byron');
update results set laps_led = 15 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Ross Chastain');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Austin Dillon');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Connor Zilisch');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Carson Hocevar');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Denny Hamlin');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Austin Cindric');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Cole Custer');
update results set laps_led = 55 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Brad Keselowski');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Erik Jones');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Bubba Wallace');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'John Hunter Nemechek');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'AJ Allmendinger');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Ryan Preece');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Ty Gibbs');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Christopher Bell');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Michael McDowell');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Austin Hill');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Cody Ware');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Shane Van Gisbergen');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Todd Gilliland');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Tyler Reddick');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Ricky Stenhouse Jr.');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Chris Buescher');
update results set laps_led = 1 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Josh Berry');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Daniel Suarez');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Ty Dillon');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Chase Elliott');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Chase Briscoe');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Noah Gragson');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Riley Herbst');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Ryan Blaney');
update results set laps_led = 0 where race_id = (select id from races where chase_round = 2) and driver_id = (select id from drivers where name = 'Zane Smith');

commit;
