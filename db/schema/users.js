import {pgTable,uuid,varchar,text,timestamp,boolean,unique} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const supabaseAuthUser = pgTable("supabase_auth_user", {
    id: uuid("id").primaryKey(),
});

export const profiles = pgTable("profiles", {
    id: uuid("id")
        .primaryKey()
        .references(() => supabaseAuthUser.id),

    displayName: varchar("display_name"),

    createdAt: timestamp("created_at", {
        withTimezone: true,
    }),

    updatedAt: timestamp("updated_at", {
        withTimezone: true,
    }),
});