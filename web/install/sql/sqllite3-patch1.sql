-- adds 'tutorial' column to user  --
alter table `user` add column `tutorial` int default 1;

-- increase patch no. for database  --
insert into `setting`(`name`, `value`) values ('patch', 1);
