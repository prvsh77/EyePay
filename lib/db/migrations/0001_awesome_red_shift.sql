CREATE TABLE "fraud_alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" integer NOT NULL,
	"risk_score" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"reasons" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "risk_score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "destination_country" text DEFAULT 'US' NOT NULL;--> statement-breakpoint
ALTER TABLE "fraud_alerts" ADD CONSTRAINT "fraud_alerts_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;