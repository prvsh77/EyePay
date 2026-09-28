-- Baseline for copilot_conversations.
-- This table was created directly with `drizzle-kit push` when the copilot
-- feature shipped and never captured in migration history, so every
-- `drizzle-kit generate` re-detected it as drift. Both statements are
-- idempotent: a no-op on databases that already have the table, and a real
-- create on fresh databases migrating from 0000.
CREATE TABLE IF NOT EXISTS "copilot_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'copilot_conversations_user_id_users_id_fk'
	) THEN
		ALTER TABLE "copilot_conversations"
			ADD CONSTRAINT "copilot_conversations_user_id_users_id_fk"
			FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
