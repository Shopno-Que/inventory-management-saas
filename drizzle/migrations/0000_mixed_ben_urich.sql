CREATE TABLE "saas_member_roles" (
	"member_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "saas_member_roles_pk" PRIMARY KEY("member_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "saas_members" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"status" varchar NOT NULL,
	"joined_at" timestamp with time zone,
	"created_at" timestamp with time zone,
	CONSTRAINT "saas_members_user_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "saas_permissions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "saas_permissions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "saas_role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "saas_role_permissions_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "saas_roles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar NOT NULL,
	"is_system" boolean,
	CONSTRAINT "saas_roles_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "store_invitations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"store_id" uuid NOT NULL,
	"email" varchar NOT NULL,
	"invited_by" uuid NOT NULL,
	"status" varchar NOT NULL,
	"expires_at" timestamp with time zone,
	"accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "store_member_roles" (
	"member_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "store_member_roles_pk" PRIMARY KEY("member_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "store_members" (
	"id" uuid PRIMARY KEY NOT NULL,
	"store_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" varchar NOT NULL,
	"invited_by" uuid,
	"joined_at" timestamp with time zone,
	"created_at" timestamp with time zone,
	CONSTRAINT "store_members_store_user_unique" UNIQUE("store_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "store_permissions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "store_permissions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "store_role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "store_role_permissions_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "store_roles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar NOT NULL,
	"is_system" boolean,
	CONSTRAINT "store_roles_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"logo_url" text,
	"currency_code" varchar,
	"timezone" varchar,
	"country_code" varchar,
	"is_active" boolean,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "stores_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" varchar,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "supabase_auth_user" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saas_member_roles" ADD CONSTRAINT "saas_member_roles_member_id_saas_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."saas_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_member_roles" ADD CONSTRAINT "saas_member_roles_role_id_saas_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."saas_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_members" ADD CONSTRAINT "saas_members_user_id_supabase_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."supabase_auth_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_role_permissions" ADD CONSTRAINT "saas_role_permissions_role_id_saas_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."saas_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_role_permissions" ADD CONSTRAINT "saas_role_permissions_permission_id_saas_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."saas_permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_invitations" ADD CONSTRAINT "store_invitations_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_invitations" ADD CONSTRAINT "store_invitations_invited_by_supabase_auth_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."supabase_auth_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_member_roles" ADD CONSTRAINT "store_member_roles_member_id_store_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."store_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_member_roles" ADD CONSTRAINT "store_member_roles_role_id_store_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."store_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_members" ADD CONSTRAINT "store_members_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_members" ADD CONSTRAINT "store_members_user_id_supabase_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."supabase_auth_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_members" ADD CONSTRAINT "store_members_invited_by_supabase_auth_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."supabase_auth_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_role_permissions" ADD CONSTRAINT "store_role_permissions_role_id_store_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."store_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_role_permissions" ADD CONSTRAINT "store_role_permissions_permission_id_store_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."store_permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_supabase_auth_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."supabase_auth_user"("id") ON DELETE no action ON UPDATE no action;