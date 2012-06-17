-- drop table--
DROP TABLE IF EXISTS `diagram`;

-- drop table--
DROP TABLE IF EXISTS `setting`;

-- drop table--
DROP TABLE IF EXISTS `diagramdata`;

-- drop table--
DROP TABLE IF EXISTS `user`;

-- create table --
CREATE TABLE `diagram` (
`id` INTEGER PRIMARY KEY,
`title` VARCHAR(255),
`description` TEXT,
`public` BOOL,
`createdDate` DATETIME NOT NULL,
`lastUpdate` DATETIME NOT NULL,
`size` INT UNSIGNED COMMENT 'The size of diagram in bytes'
);

-- create table --
CREATE  TABLE `setting` (
    `name` VARCHAR(128) PRIMARY KEY,
    `value` TEXT
);

-- create table --
CREATE  TABLE IF NOT EXISTS `user` (
    `id` INTEGER PRIMARY KEY,
    `email` VARCHAR(128) unique,
    `password` VARCHAR(128),
    `name` VARCHAR(128),
    `createdDate` DATETIME NOT NULL,
    `lastLoginDate` DATETIME,
    `lastLoginIP` CHAR(40),
    `lastBrowserType` VARCHAR(255),
    `admin` boolean default false
);


-- create table --
CREATE  TABLE IF NOT EXISTS `diagramdata` (  
    `diagramId` INT UNSIGNED NOT NULL,
    `type` VARCHAR(10) NOT NULL, -- only 'dia', 'svg', 'jpg', 'png'
    `fileName` VARCHAR(255),
    `fileSize` INT UNSIGNED COMMENT 'The size of diagram in bytes',
    `lastUpdate` DATETIME NOT NULL,  
    FOREIGN KEY(diagramId) REFERENCES diagram(id),
    PRIMARY KEY (`diagramId`, `type`)    
);
