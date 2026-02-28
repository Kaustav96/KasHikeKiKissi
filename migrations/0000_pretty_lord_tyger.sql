CREATE TABLE "faqs" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" text DEFAULT 'general' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"rsvp_status" text DEFAULT 'pending' NOT NULL,
	"adults_count" integer DEFAULT 1 NOT NULL,
	"children_count" integer DEFAULT 0 NOT NULL,
	"food_preference" text DEFAULT 'vegetarian' NOT NULL,
	"events_attending" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"dietary_requirements" text DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"invite_slug" text NOT NULL,
	"side" text DEFAULT 'both' NOT NULL,
	"table_number" integer,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"updated_at" timestamp DEFAULT NOW() NOT NULL,
	CONSTRAINT "guests_invite_slug_unique" UNIQUE("invite_slug")
);
--> statement-breakpoint
CREATE TABLE "message_logs" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guest_id" varchar(36) NOT NULL,
	"guest_name" text NOT NULL,
	"phone" text NOT NULL,
	"template_name" text NOT NULL,
	"message_type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"whatsapp_message_id" text DEFAULT '' NOT NULL,
	"error_message" text DEFAULT '' NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "story_milestones" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"date" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"map_url" text DEFAULT '' NOT NULL,
	"map_embed_url" text DEFAULT '' NOT NULL,
	"directions" text DEFAULT '' NOT NULL,
	"accommodation" text DEFAULT '' NOT NULL,
	"contact_info" text DEFAULT '' NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wedding_config" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_date" timestamp,
	"date_confirmed" boolean DEFAULT false NOT NULL,
	"venue_name" text DEFAULT 'To Be Announced' NOT NULL,
	"venue_address" text DEFAULT '' NOT NULL,
	"venue_map_url" text DEFAULT '' NOT NULL,
	"couple_story" text DEFAULT '' NOT NULL,
	"admin_password_hash" text DEFAULT '' NOT NULL,
	"upi_id" text DEFAULT '' NOT NULL,
	"background_music_url" text DEFAULT '' NOT NULL,
	"groom_music_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"bride_music_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wedding_events" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"venue_name" text DEFAULT '' NOT NULL,
	"venue_address" text DEFAULT '' NOT NULL,
	"venue_map_url" text DEFAULT '' NOT NULL,
	"is_main_event" boolean DEFAULT false NOT NULL,
	"dress_code" text DEFAULT '' NOT NULL,
	"how_to_reach" text DEFAULT '' NOT NULL,
	"accommodation" text DEFAULT '' NOT NULL,
	"distance_info" text DEFAULT '' NOT NULL,
	"contact_person" text DEFAULT '' NOT NULL,
	"side" text DEFAULT 'both' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT NOW() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_faq_sort" ON "faqs" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "idx_guests_slug" ON "guests" USING btree ("invite_slug");--> statement-breakpoint
CREATE INDEX "idx_guests_rsvp" ON "guests" USING btree ("rsvp_status");--> statement-breakpoint
CREATE INDEX "idx_guests_food" ON "guests" USING btree ("food_preference");--> statement-breakpoint
CREATE INDEX "idx_guests_side" ON "guests" USING btree ("side");--> statement-breakpoint
CREATE INDEX "idx_guests_created" ON "guests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_logs_guest" ON "message_logs" USING btree ("guest_id");--> statement-breakpoint
CREATE INDEX "idx_logs_type" ON "message_logs" USING btree ("message_type");--> statement-breakpoint
CREATE INDEX "idx_logs_status" ON "message_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_logs_created" ON "message_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_story_sort" ON "story_milestones" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "idx_venues_sort" ON "venues" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "idx_events_sort" ON "wedding_events" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "idx_events_start" ON "wedding_events" USING btree ("start_time");