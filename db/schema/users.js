import { pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey(),
    email: varchar("email").unique().notNull(),
    fullName: varchar("full_name"),
    avatarUrl: text("avatar_url"),
    phone: varchar("phone"),
    isActive: boolean("is_active"),
    createdAt: timestamp("created_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
});
