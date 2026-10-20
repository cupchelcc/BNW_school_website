CREATE TABLE `academic_courses` (
	`id` text PRIMARY KEY NOT NULL,
	`level` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`learning_areas` text,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`type` text DEFAULT 'general' NOT NULL,
	`is_pinned` integer DEFAULT false NOT NULL,
	`attachment_url` text,
	`status` text DEFAULT 'published' NOT NULL,
	`author_id` text,
	`published_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `announcements_slug_unique` ON `announcements` (`slug`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`user_email` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`details` text,
	`ip_address` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `botanical_plants` (
	`id` text PRIMARY KEY NOT NULL,
	`thai_name` text NOT NULL,
	`common_name` text,
	`scientific_name` text NOT NULL,
	`family` text NOT NULL,
	`characteristics` text NOT NULL,
	`location_in_school` text NOT NULL,
	`educational_value` text,
	`image_url` text,
	`verification_status` text DEFAULT 'verified' NOT NULL,
	`qr_code` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category` text DEFAULT 'general' NOT NULL,
	`file_url` text NOT NULL,
	`file_size` text,
	`file_type` text,
	`download_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `e_services` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`target_group` text DEFAULT 'general' NOT NULL,
	`icon` text DEFAULT 'Globe' NOT NULL,
	`url` text NOT NULL,
	`is_external` integer DEFAULT true NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`start_date` text NOT NULL,
	`end_date` text,
	`location` text,
	`cover_image_url` text,
	`status` text DEFAULT 'published' NOT NULL,
	`author_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `media_files` (
	`id` text PRIMARY KEY NOT NULL,
	`file_name` text NOT NULL,
	`original_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`file_size` integer NOT NULL,
	`url` text NOT NULL,
	`alt_text` text,
	`uploaded_by` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text,
	`content` text NOT NULL,
	`category` text DEFAULT 'general' NOT NULL,
	`cover_image_url` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`author_id` text,
	`view_count` integer DEFAULT 0 NOT NULL,
	`published_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `news_slug_unique` ON `news` (`slug`);--> statement-breakpoint
CREATE TABLE `pages` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`content` text DEFAULT '[]' NOT NULL,
	`author_id` text,
	`published_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_unique` ON `pages` (`slug`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`position` text NOT NULL,
	`department` text DEFAULT 'academic' NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`image_url` text,
	`qualification` text,
	`email` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `theme_settings` (
	`id` text PRIMARY KEY DEFAULT 'current' NOT NULL,
	`site_name` text DEFAULT 'โรงเรียนวัดบางน้ำวน (รอดพิทยาคม)' NOT NULL,
	`site_description` text DEFAULT 'สถานศึกษาแห่งการเรียนรู้ มุ่งสู่คุณภาพ คุณธรรมนำความรู้',
	`logo_url` text DEFAULT '/images/logo-placeholder.svg',
	`favicon_url` text DEFAULT '/favicon.ico',
	`primary_color` text DEFAULT '#0b1f3c' NOT NULL,
	`secondary_color` text DEFAULT '#eab308' NOT NULL,
	`accent_color` text DEFAULT '#1b71c4' NOT NULL,
	`font_family` text DEFAULT 'IBM Plex Sans Thai' NOT NULL,
	`header_layout` text DEFAULT 'standard' NOT NULL,
	`footer_copyright` text DEFAULT '© 2026 โรงเรียนวัดบางน้ำวน (รอดพิทยาคม) สังกัด สพป.สมุทรสาคร สงวนลิขสิทธิ์',
	`contact_phone` text DEFAULT '034-490-XXX (อยู่ระหว่างยืนยันข้อมูล)',
	`contact_email` text DEFAULT 'contact@bnw.ac.th',
	`contact_address` text DEFAULT 'เลขที่ 40 หมู่ 4 ตำบลบางน้ำวน อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000',
	`facebook_url` text DEFAULT 'https://www.facebook.com/bnwschool',
	`line_url` text,
	`youtube_url` text,
	`nav_menu_items` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'author' NOT NULL,
	`avatar_url` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);