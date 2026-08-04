import { pgTable, uuid, varchar, text, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const staffs = pgTable("staffs", {
    id: uuid("id").primaryKey(),
    scopeType: varchar("scope_type").notNull(),
    scopeId: uuid("scope_id"),
    userId: uuid("user_id").notNull().references(() => users.id),
    invitedBy: uuid("invited_by").references(() => users.id),
    status: varchar("status"),
    joinedAt: timestamp("joined_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }),
});

export const roles = pgTable("roles", {
    id: uuid("id").primaryKey(),
    name: varchar("name").notNull(),
    code: varchar("code").unique().notNull(),
    scope: varchar("scope").notNull(),
    isSystem: boolean("is_system"),
    createdAt: timestamp("created_at", { withTimezone: true }),
});

export const permissions = pgTable("permissions", {
    id: uuid("id").primaryKey(),
    name: varchar("name").notNull(),
    code: varchar("code").unique().notNull(),
    description: text("description"),
    scope: varchar("scope").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }),
});

export const staffRoles = pgTable("staff_roles", {
    staffId: uuid("staff_id").notNull().references(() => staffs.id),
    roleId: uuid("role_id").notNull().references(() => roles.id),
    assignedBy: uuid("assigned_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }),
}, (table) => [
    primaryKey({ columns: [table.staffId, table.roleId] })
]);

export const rolePermissions = pgTable("role_permissions", {
    roleId: uuid("role_id").notNull().references(() => roles.id),
    permissionId: uuid("permission_id").notNull().references(() => permissions.id),
    createdAt: timestamp("created_at", { withTimezone: true }),
}, (table) => [
    primaryKey({ columns: [table.roleId, table.permissionId] })
]);

export const staffInvitations = pgTable("staff_invitations", {
    id: uuid("id").primaryKey(),
    scopeType: varchar("scope_type"),
    scopeId: uuid("scope_id"),
    email: varchar("email").notNull(),
    invitedBy: uuid("invited_by").notNull().references(() => users.id),
    status: varchar("status"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }),
});

export const activityLogs = pgTable("activity_logs", {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    scopeType: varchar("scope_type"),
    scopeId: uuid("scope_id"),
    action: varchar("action"),
    entityType: varchar("entity_type"),
    entityId: uuid("entity_id"),
    ipAddress: varchar("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }),
});
