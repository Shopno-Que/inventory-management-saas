CREATE TABLE "store_transfer_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"from_user_id" uuid NOT NULL,
	"to_user_id" uuid,
	"target_email" varchar(320) NOT NULL,
	"status" varchar(40) DEFAULT 'pending' NOT NULL,
	"token" varchar(128) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "store_transfer_requests_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "store_transfer_requests" ADD CONSTRAINT "store_transfer_requests_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_transfer_requests" ADD CONSTRAINT "store_transfer_requests_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_transfer_requests" ADD CONSTRAINT "store_transfer_requests_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;