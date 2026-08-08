import {pgTable, uuid, varchar, timestamp, boolean, unique, primaryKey} from "drizzle-orm/pg-core";

import { supabaseAuthUser } from "./users";

export const saasMembers = pgTable(
    "saas_members",
    {
        id: uuid("id").primaryKey(),

        userId: uuid("user_id")
            .notNull()
            .references(() => supabaseAuthUser.id),

        status: varchar("status").notNull(),

        joinedAt: timestamp("joined_at", {
            withTimezone: true,
        }),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        }),
    },
    (table) => [
        unique("saas_members_user_unique").on(table.userId),
    ],
);

export const saasRoles = pgTable("saas_roles", {
    id: uuid("id").primaryKey(),

    code: varchar("code").notNull().unique(),

    name: varchar("name").notNull(),

    isSystem: boolean("is_system"),
});

export const saasPermissions = pgTable("saas_permissions", {
    id: uuid("id").primaryKey(),

    code: varchar("code").notNull().unique(),

    name: varchar("name").notNull(),
});

export const saasRolePermissions = pgTable(
    "saas_role_permissions",
    {
        roleId: uuid("role_id")
            .notNull()
            .references(() => saasRoles.id),

        permissionId: uuid("permission_id")
            .notNull()
            .references(() => saasPermissions.id),
    },
    (table) => [
        primaryKey({
            name: "saas_role_permissions_pk",
            columns: [table.roleId, table.permissionId],
        }),
    ],
);

export const saasMemberRoles = pgTable(
    "saas_member_roles",
    {
        memberId: uuid("member_id")
            .notNull()
            .references(() => saasMembers.id),

        roleId: uuid("role_id")
            .notNull()
            .references(() => saasRoles.id),
    },
    (table) => [
        primaryKey({
            name: "saas_member_roles_pk",
            columns: [table.memberId, table.roleId],
        }),
    ],
);