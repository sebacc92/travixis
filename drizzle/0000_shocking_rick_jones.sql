CREATE TABLE `baggage_claims` (
	`id` text PRIMARY KEY NOT NULL,
	`claim_id` text NOT NULL,
	`carrier_name` text,
	`pir_number` text,
	`baggage_type` text,
	`total_loss` integer DEFAULT true NOT NULL,
	`weight_kg` real,
	`weight_based_amount_usd` real,
	`coverage_cap_usd` real DEFAULT 1200 NOT NULL,
	`reported_to_carrier` integer DEFAULT false,
	`reported_to_carrier_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`claim_id`) REFERENCES `claims`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `baggage_claims_claim_id_unique` ON `baggage_claims` (`claim_id`);--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `chat_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chat_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`last_active` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `claim_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`claim_id` text NOT NULL,
	`document_type` text NOT NULL,
	`storage_key` text NOT NULL,
	`url` text,
	`file_name` text,
	`mime_type` text,
	`file_size_bytes` integer,
	`uploaded_by` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`claim_id`) REFERENCES `claims`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `claim_documents_claim_idx` ON `claim_documents` (`claim_id`);--> statement-breakpoint
CREATE INDEX `claim_documents_type_idx` ON `claim_documents` (`claim_id`,`document_type`);--> statement-breakpoint
CREATE TABLE `claim_status_history` (
	`id` text PRIMARY KEY NOT NULL,
	`claim_id` text NOT NULL,
	`from_status` text,
	`to_status` text NOT NULL,
	`changed_by` text,
	`reason` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`claim_id`) REFERENCES `claims`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `claim_history_claim_idx` ON `claim_status_history` (`claim_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `claims` (
	`id` text PRIMARY KEY NOT NULL,
	`policy_id` text NOT NULL,
	`trip_id` text NOT NULL,
	`user_id` text NOT NULL,
	`claim_number` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`description` text,
	`incident_date` text NOT NULL,
	`claimed_amount_usd` real,
	`approved_amount_usd` real,
	`paid_at` text,
	`agent_notes` text,
	`resolved_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`policy_id`) REFERENCES `policies`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `claims_number_idx` ON `claims` (`claim_number`);--> statement-breakpoint
CREATE INDEX `claims_policy_status_idx` ON `claims` (`policy_id`,`status`);--> statement-breakpoint
CREATE INDEX `claims_trip_type_idx` ON `claims` (`trip_id`,`type`);--> statement-breakpoint
CREATE INDEX `claims_user_created_idx` ON `claims` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `claims_status_idx` ON `claims` (`status`);--> statement-breakpoint
CREATE TABLE `medical_claims` (
	`id` text PRIMARY KEY NOT NULL,
	`claim_id` text NOT NULL,
	`provider_name` text,
	`provider_address` text,
	`provider_country` text,
	`provider_lat` real,
	`provider_lon` real,
	`distance_from_home_km` real,
	`distance_rule_validated` integer DEFAULT false NOT NULL,
	`medical_event_type` text,
	`diagnosis` text,
	`treatment_summary` text,
	`copay_amount_usd` real DEFAULT 0 NOT NULL,
	`hospitalized` integer DEFAULT false,
	`hospitalization_days` integer,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`claim_id`) REFERENCES `claims`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `medical_claims_claim_id_unique` ON `medical_claims` (`claim_id`);--> statement-breakpoint
CREATE TABLE `medication_claims` (
	`id` text PRIMARY KEY NOT NULL,
	`claim_id` text NOT NULL,
	`pharmacy_name` text,
	`pharmacy_country` text,
	`medication_list` text,
	`user_paid_amount_usd` real NOT NULL,
	`reimbursement_pct` real DEFAULT 30 NOT NULL,
	`reimbursed_amount_usd` real,
	`prescription_required` integer DEFAULT true,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`claim_id`) REFERENCES `claims`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `medication_claims_claim_id_unique` ON `medication_claims` (`claim_id`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`annual_price_usd` real NOT NULL,
	`max_days_per_trip` integer DEFAULT 60 NOT NULL,
	`medical_coverage_usd` real NOT NULL,
	`baggage_coverage_usd` real DEFAULT 1200 NOT NULL,
	`baggage_per_kg_usd` real DEFAULT 40 NOT NULL,
	`medication_reimburse_pct` real DEFAULT 30 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `policies` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plan_id` text NOT NULL,
	`policy_number` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`paid_amount_usd` real,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `policies_number_idx` ON `policies` (`policy_number`);--> statement-breakpoint
CREATE INDEX `policies_vigency_idx` ON `policies` (`user_id`,`status`,`start_date`,`end_date`);--> statement-breakpoint
CREATE INDEX `policies_user_idx` ON `policies` (`user_id`);--> statement-breakpoint
CREATE INDEX `policies_plan_idx` ON `policies` (`plan_id`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`ai_enabled` integer DEFAULT true NOT NULL,
	`ai_tone` text,
	`ai_instructions` text,
	`ai_knowledge` text,
	`ai_initial_greeting` text,
	`ai_call_to_action` text,
	`whatsapp_number` text DEFAULT '5491150532300' NOT NULL,
	`ai_avatar_url` text,
	`popup_enabled` integer DEFAULT false NOT NULL,
	`popup_image_url` text,
	`popup_title` text,
	`popup_description` text,
	`popup_cta_text` text,
	`popup_cta_link` text,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` text PRIMARY KEY NOT NULL,
	`policy_id` text NOT NULL,
	`user_id` text NOT NULL,
	`destination` text NOT NULL,
	`destination_country` text,
	`destination_lat` real,
	`destination_lon` real,
	`departure_date` text NOT NULL,
	`return_date` text,
	`duration_days` integer,
	`status` text DEFAULT 'planned' NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`policy_id`) REFERENCES `policies`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `trips_policy_status_idx` ON `trips` (`policy_id`,`status`);--> statement-breakpoint
CREATE INDEX `trips_user_status_idx` ON `trips` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `trips_departure_idx` ON `trips` (`departure_date`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`phone` text,
	`date_of_birth` text,
	`national_id` text,
	`home_street` text NOT NULL,
	`home_city` text NOT NULL,
	`home_state` text NOT NULL,
	`home_country` text DEFAULT 'AR' NOT NULL,
	`home_postal_code` text,
	`home_lat` real,
	`home_lon` real,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_national_id_idx` ON `users` (`national_id`);