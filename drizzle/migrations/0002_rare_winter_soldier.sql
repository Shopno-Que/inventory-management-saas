ALTER TABLE "saas_member_roles" DROP CONSTRAINT "saas_member_roles_member_id_saas_members_id_fk";
--> statement-breakpoint
ALTER TABLE "saas_member_roles" DROP CONSTRAINT "saas_member_roles_role_id_saas_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "saas_members" DROP CONSTRAINT "saas_members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "saas_role_permissions" DROP CONSTRAINT "saas_role_permissions_role_id_saas_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "saas_role_permissions" DROP CONSTRAINT "saas_role_permissions_permission_id_saas_permissions_id_fk";
--> statement-breakpoint
ALTER TABLE "saas_roles" ALTER COLUMN "is_system" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "saas_roles" ALTER COLUMN "is_system" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "saas_member_roles" ADD CONSTRAINT "saas_member_roles_member_id_saas_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."saas_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_member_roles" ADD CONSTRAINT "saas_member_roles_role_id_saas_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."saas_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_members" ADD CONSTRAINT "saas_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_role_permissions" ADD CONSTRAINT "saas_role_permissions_role_id_saas_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."saas_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_role_permissions" ADD CONSTRAINT "saas_role_permissions_permission_id_saas_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."saas_permissions"("id") ON DELETE restrict ON UPDATE no action;