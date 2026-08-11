CREATE TABLE "store_member_permissions" (
	"member_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"effect" varchar NOT NULL,
	CONSTRAINT "store_member_permissions_pk" PRIMARY KEY("member_id","permission_id")
);
--> statement-breakpoint
ALTER TABLE "store_roles" DROP CONSTRAINT "store_roles_code_unique";--> statement-breakpoint
ALTER TABLE "saas_members" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "saas_permissions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "saas_roles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "store_invitations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "store_members" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "store_permissions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "store_roles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "store_roles" ALTER COLUMN "is_system" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "store_roles" ALTER COLUMN "is_system" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "owner_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "is_active" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "is_active" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "store_roles" ADD COLUMN "store_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "store_member_permissions" ADD CONSTRAINT "store_member_permissions_member_id_store_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."store_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_member_permissions" ADD CONSTRAINT "store_member_permissions_permission_id_store_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."store_permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_roles" ADD CONSTRAINT "store_roles_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_roles" ADD CONSTRAINT "store_roles_store_code_unique" UNIQUE("store_id","code");