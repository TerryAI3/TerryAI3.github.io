CREATE TABLE `cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`location` varchar(200),
	`completedDate` varchar(50),
	`mainImage` varchar(500),
	`images` text,
	`products` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cases_id` PRIMARY KEY(`id`),
	CONSTRAINT `cases_slug_unique` UNIQUE(`slug`)
);
