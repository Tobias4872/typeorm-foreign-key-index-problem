# typeorm-foreign-key-index-problem

This repo contains some code which shows a problem in TypeOrm when updating a foreign key from NULL to NOT NULL.

## Setup

1. git clone https://github.com/Tobias4872/typeorm-foreign-key-index-problem.git
2. cd typeorm-foreign-key-index-problem
3. npm install
4. tsc -p .
5. mysqladmin -uroot -proot -h0.0.0.0 create foreign_key_index_problem # You might want to change credentials here and in "index.ts"
6. node index.js

## The problem

```
>>>> Initial setup ...
executing query: SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'foreign_key_index_problem' AND TABLE_NAME IN ('player_specification', 'zone')
executing query: SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'foreign_key_index_problem'
executing query: SELECT * FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = 'foreign_key_index_problem' AND INDEX_NAME != 'PRIMARY'
executing query: SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'foreign_key_index_problem' AND REFERENCED_COLUMN_NAME IS NOT NULL
executing query: START TRANSACTION
executing query: CREATE TABLE `player_specification` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `name` varchar(128) NOT NULL) ENGINE=InnoDB;
executing query: CREATE TABLE `zone` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `name` varchar(128) NOT NULL, `playerSpecification` int(11)) ENGINE=InnoDB;
executing query: ALTER TABLE zone ADD CONSTRAINT `fk_bcf34103e5082f20f9fb2d6a3e0` FOREIGN KEY (`playerSpecification`) REFERENCES `player_specification`(`id`)
executing query: COMMIT
>>>> First update ...
executing query: SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'foreign_key_index_problem' AND TABLE_NAME IN ('player_specification', 'zone')
executing query: SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'foreign_key_index_problem'
executing query: SELECT * FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = 'foreign_key_index_problem' AND INDEX_NAME != 'PRIMARY'
executing query: SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'foreign_key_index_problem' AND REFERENCED_COLUMN_NAME IS NOT NULL
executing query: SHOW INDEX FROM `player_specification` WHERE Key_name = 'PRIMARY'
executing query: SHOW INDEX FROM `zone` WHERE Key_name = 'PRIMARY'
executing query: START TRANSACTION
executing query: ALTER TABLE `zone` DROP FOREIGN KEY `fk_bcf34103e5082f20f9fb2d6a3e0`
executing query: ALTER TABLE `zone` CHANGE `playerSpecification` `playerSpecification` int(11) NOT NULL
executing query: COMMIT
>>>> Second update ...
executing query: SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'foreign_key_index_problem' AND TABLE_NAME IN ('player_specification', 'zone')
executing query: SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'foreign_key_index_problem'
executing query: SELECT * FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = 'foreign_key_index_problem' AND INDEX_NAME != 'PRIMARY'
executing query: SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'foreign_key_index_problem' AND REFERENCED_COLUMN_NAME IS NOT NULL
executing query: SHOW INDEX FROM `player_specification` WHERE Key_name = 'PRIMARY'
executing query: SHOW INDEX FROM `zone` WHERE Key_name = 'PRIMARY'
executing query: START TRANSACTION
executing query: ALTER TABLE zone ADD CONSTRAINT `fk_bcf34103e5082f20f9fb2d6a3e0` FOREIGN KEY (`playerSpecification`) REFERENCES `player_specification`(`id`)
executing query: ALTER TABLE `zone` DROP INDEX `fk_bcf34103e5082f20f9fb2d6a3e0`
query failed: ALTER TABLE `zone` DROP INDEX `fk_bcf34103e5082f20f9fb2d6a3e0`
executing query: ROLLBACK
(node:25535) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: ER_DROP_INDEX_FK: Cannot drop index 'fk_bcf34103e5082f20f9fb2d6a3e0': needed in a foreign key constraint
```

As you can see the initial setup of the database works fine. But when I enter the two updates (after applying "nullable: false" to "zone.playerSpecification), you can see that the first run just deletes the foreign key, but does not update the column while on the second run the foreign key is recreated and for some reason the sync tries to delete the index which fails as the foreign key depends on it.
