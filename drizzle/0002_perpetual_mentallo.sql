CREATE TABLE `product_inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int,
	`name` varchar(100) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`email` varchar(320),
	`company` varchar(200),
	`message` text,
	`status` enum('pending','contacted','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_series` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`nameEn` varchar(100),
	`code` varchar(50) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`coverImage` varchar(500),
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_series_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_series_code_unique` UNIQUE(`code`),
	CONSTRAINT `product_series_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `categoryId` int;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `price` decimal(10,2);--> statement-breakpoint
ALTER TABLE `products` ADD `seriesId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `nameEn` varchar(200);--> statement-breakpoint
ALTER TABLE `products` ADD `features` text;--> statement-breakpoint
ALTER TABLE `products` ADD `dimensions` varchar(200);--> statement-breakpoint
ALTER TABLE `products` ADD `materials` text;--> statement-breakpoint
ALTER TABLE `products` ADD `colors` text;--> statement-breakpoint
ALTER TABLE `products` ADD `sortOrder` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `isFeatured` int DEFAULT 0 NOT NULL;