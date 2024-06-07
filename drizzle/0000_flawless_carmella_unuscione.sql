CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`ip` text NOT NULL,
	`discord_id` text NOT NULL,
	`discord_name` text NOT NULL,
	`quota` integer DEFAULT 2 NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_ip_discord_id_unique` ON `users` (`ip`,`discord_id`);