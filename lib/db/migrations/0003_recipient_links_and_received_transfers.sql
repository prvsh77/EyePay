ALTER TABLE "recipients" ADD COLUMN "linked_user_id" integer;
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "related_transaction_id" integer;
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "credit_user_id" integer;
--> statement-breakpoint
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_linked_user_id_users_id_fk" FOREIGN KEY ("linked_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_related_transaction_id_transactions_id_fk" FOREIGN KEY ("related_transaction_id") REFERENCES "public"."transactions"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_credit_user_id_users_id_fk" FOREIGN KEY ("credit_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
