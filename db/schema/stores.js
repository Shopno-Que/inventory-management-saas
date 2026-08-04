import { pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const stores = pgTable("stores", {
    id: uuid("id").primaryKey(),
    ownerId: uuid("owner_id").notNull().references(() => users.id),
    name: varchar("name").notNull(),
    slug: varchar("slug").unique().notNull(),
    logoUrl: text("logo_url"),
    country: varchar("country"),
    isActive: boolean("is_active"),
    createdAt: timestamp("created_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
});
