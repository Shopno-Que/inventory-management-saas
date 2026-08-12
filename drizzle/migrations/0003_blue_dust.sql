ALTER TABLE "store_invitations" DROP CONSTRAINT "store_invitations_store_id_stores_id_fk";
--> statement-breakpoint
ALTER TABLE "store_invitations" DROP CONSTRAINT "store_invitations_invited_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "store_member_permissions" DROP CONSTRAINT "store_member_permissions_member_id_store_members_id_fk";
--> statement-breakpoint
ALTER TABLE "store_member_permissions" DROP CONSTRAINT "store_member_permissions_permission_id_store_permissions_id_fk";
--> statement-breakpoint
ALTER TABLE "store_member_roles" DROP CONSTRAINT "store_member_roles_member_id_store_members_id_fk";
--> statement-breakpoint
ALTER TABLE "store_member_roles" DROP CONSTRAINT "store_member_roles_role_id_store_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "store_members" DROP CONSTRAINT "store_members_store_id_stores_id_fk";
--> statement-breakpoint
ALTER TABLE "store_members" DROP CONSTRAINT "store_members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "store_members" DROP CONSTRAINT "store_members_invited_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "store_role_permissions" DROP CONSTRAINT "store_role_permissions_role_id_store_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "store_role_permissions" DROP CONSTRAINT "store_role_permissions_permission_id_store_permissions_id_fk";
--> statement-breakpoint
ALTER TABLE "store_roles" DROP CONSTRAINT "store_roles_store_id_stores_id_fk";
--> statement-breakpoint
ALTER TABLE "store_invitations" ALTER COLUMN "invited_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "store_invitations" ADD CONSTRAINT "store_invitations_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_invitations" ADD CONSTRAINT "store_invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_member_permissions" ADD CONSTRAINT "store_member_permissions_member_id_store_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."store_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_member_permissions" ADD CONSTRAINT "store_member_permissions_permission_id_store_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."store_permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_member_roles" ADD CONSTRAINT "store_member_roles_member_id_store_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."store_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_member_roles" ADD CONSTRAINT "store_member_roles_role_id_store_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."store_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_members" ADD CONSTRAINT "store_members_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_members" ADD CONSTRAINT "store_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_members" ADD CONSTRAINT "store_members_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_role_permissions" ADD CONSTRAINT "store_role_permissions_role_id_store_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."store_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_role_permissions" ADD CONSTRAINT "store_role_permissions_permission_id_store_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."store_permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_roles" ADD CONSTRAINT "store_roles_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;