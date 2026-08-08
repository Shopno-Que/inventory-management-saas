import {pgTable, uuid, varchar, text, timestamp, boolean, unique, primaryKey} from "drizzle-orm/pg-core";
import { supabaseAuthUser } from "./users";

export const stores = pgTable("stores", {
    id: uuid("id").primaryKey(),

    name: varchar("name").notNull(),

    slug: varchar("slug").notNull().unique(),

    logoUrl: text("logo_url"),

    currencyCode: varchar("currency_code"),

    timezone: varchar("timezone"),

    countryCode: varchar("country_code"),

    isActive: boolean("is_active"),

    createdAt: timestamp("created_at", {
        withTimezone: true,
    }),

    updatedAt: timestamp("updated_at", {
        withTimezone: true,
    }),
});

export const storeMembers = pgTable(
    "store_members",
    {
        id: uuid("id").primaryKey(),

        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id),

        userId: uuid("user_id")
            .notNull()
            .references(() => supabaseAuthUser.id),

        status: varchar("status").notNull(),

        invitedBy: uuid("invited_by").references(() => supabaseAuthUser.id),

        joinedAt: timestamp("joined_at", {
            withTimezone: true,
        }),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        }),
    },
    (table) => [
        unique("store_members_store_user_unique").on(
            table.storeId,
            table.userId,
        ),
    ],
);

export const storeRoles = pgTable("store_roles", {
    id: uuid("id").primaryKey(),

    code: varchar("code").notNull().unique(),

    name: varchar("name").notNull(),

    isSystem: boolean("is_system"),
});

export const storePermissions = pgTable("store_permissions", {
    id: uuid("id").primaryKey(),

    code: varchar("code").notNull().unique(),

    name: varchar("name").notNull(),
});

export const storeRolePermissions = pgTable(
    "store_role_permissions",
    {
        roleId: uuid("role_id")
            .notNull()
            .references(() => storeRoles.id),

        permissionId: uuid("permission_id")
            .notNull()
            .references(() => storePermissions.id),
    },
    (table) => [
        primaryKey({
            name: "store_role_permissions_pk",
            columns: [table.roleId, table.permissionId],
        }),
    ],
);

export const storeMemberRoles = pgTable(
    "store_member_roles",
    {
        memberId: uuid("member_id")
            .notNull()
            .references(() => storeMembers.id),

        roleId: uuid("role_id")
            .notNull()
            .references(() => storeRoles.id),
    },
    (table) => [
        primaryKey({
            name: "store_member_roles_pk",
            columns: [table.memberId, table.roleId],
        }),
    ],
);

export const storeInvitations = pgTable("store_invitations", {
    id: uuid("id").primaryKey(),

    storeId: uuid("store_id")
        .notNull()
        .references(() => stores.id),

    email: varchar("email").notNull(),

    invitedBy: uuid("invited_by")
        .notNull()
        .references(() => supabaseAuthUser.id),

    status: varchar("status").notNull(),

    expiresAt: timestamp("expires_at", {
        withTimezone: true,
    }),

    acceptedAt: timestamp("accepted_at", {
        withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
        withTimezone: true,
    }),
});