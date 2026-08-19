import {pgTable, uuid, varchar, text, timestamp, boolean, unique, primaryKey} from "drizzle-orm/pg-core";
import { supabaseAuthUser } from "../ref-schema.js";

export const stores = pgTable("stores", {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name").notNull(),

    ownerId: uuid("owner_id")
        .references(() => supabaseAuthUser.id, {
            onDelete: "cascade",
        }),

    slug: varchar("slug").notNull().unique(),

    logoUrl: text("logo_url"),

    currencyCode: varchar("currency_code"),

    timezone: varchar("timezone"),

    countryCode: varchar("country_code"),

    isActive: boolean("is_active")
        .notNull()
        .default(false),

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
        id: uuid("id").primaryKey().defaultRandom(),

        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, {
                onDelete: "cascade",
            }),

        userId: uuid("user_id")
            .notNull()
            .references(() => supabaseAuthUser.id, {
                onDelete: "cascade",
            }),

        status: varchar("status").notNull(),

        invitedBy: uuid("invited_by")
            .references(() => supabaseAuthUser.id, {
                onDelete: "set null",
            }),

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

export const storeTransferRequests = pgTable(
    "store_transfer_requests",
    {
        id: uuid("id")
            .primaryKey()
            .defaultRandom(),

        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, {
                onDelete: "cascade",
            }),

        fromUserId: uuid("from_user_id")
            .notNull()
            .references(() => supabaseAuthUser.id, {
                onDelete: "cascade",
            }),

        toUserId: uuid("to_user_id")
            .references(() => supabaseAuthUser.id, {
                onDelete: "cascade",
            }),

        targetEmail: varchar("target_email", {
            length: 320,
        }).notNull(),

        status: varchar("status", {
            length: 40,
        })
            .notNull()
            .default("pending"),

        token: varchar("token", {
            length: 128,
        })
            .notNull()
            .unique(),

        expiresAt: timestamp("expires_at", {
            withTimezone: true,
        }).notNull(),

        acceptedAt: timestamp("accepted_at", {
            withTimezone: true,
        }),

        confirmedAt: timestamp("confirmed_at", {
            withTimezone: true,
        }),

        completedAt: timestamp("completed_at", {
            withTimezone: true,
        }),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
        }),
    },
);

export const storeRoles = pgTable(
    "store_roles",
    {
        id: uuid("id").primaryKey().defaultRandom(),

        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, {
                onDelete: "cascade",
            }),

        code: varchar("code").notNull(),

        name: varchar("name").notNull(),

        isSystem: boolean("is_system")
            .notNull()
            .default(false),
    },
    (table) => [
        unique("store_roles_store_code_unique").on(
            table.storeId,
            table.code,
        ),
    ],
);

export const storePermissions = pgTable("store_permissions", {
    id: uuid("id").primaryKey().defaultRandom(),

    code: varchar("code").notNull().unique(),

    name: varchar("name").notNull(),
});

export const storeRolePermissions = pgTable(
    "store_role_permissions",
    {
        roleId: uuid("role_id")
            .notNull()
            .references(() => storeRoles.id, {
                onDelete: "cascade",
            }),

        permissionId: uuid("permission_id")
            .notNull()
            .references(() => storePermissions.id, {
                onDelete: "cascade",
            }),
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
            .references(() => storeMembers.id, {
                onDelete: "cascade",
            }),

        roleId: uuid("role_id")
            .notNull()
            .references(() => storeRoles.id, {
                onDelete: "cascade",
            }),
    },
    (table) => [
        primaryKey({
            name: "store_member_roles_pk",
            columns: [table.memberId, table.roleId],
        }),
    ],
);

export const storeMemberPermissions = pgTable(
    "store_member_permissions",
    {
        memberId: uuid("member_id")
            .notNull()
            .references(() => storeMembers.id, {
                onDelete: "cascade",
            }),

        permissionId: uuid("permission_id")
            .notNull()
            .references(() => storePermissions.id, {
                onDelete: "cascade",
            }),

        effect: varchar("effect").notNull(),
    },
    (table) => [
        primaryKey({
            name: "store_member_permissions_pk",
            columns: [
                table.memberId,
                table.permissionId,
            ],
        }),
    ],
);

export const storeInvitations = pgTable("store_invitations", {
    id: uuid("id").primaryKey().defaultRandom(),

    storeId: uuid("store_id")
        .notNull()
        .references(() => stores.id, {
            onDelete: "cascade",
        }),

    email: varchar("email").notNull(),

    invitedBy: uuid("invited_by")
        .references(() => supabaseAuthUser.id, {
            onDelete: "set null",
        }),

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