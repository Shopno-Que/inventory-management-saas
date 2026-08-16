import { pgSchema, uuid, text } from "drizzle-orm/pg-core";

// Declare the existing Supabase auth schema (don't manage its migrations)
export const authSchema = pgSchema("auth");

// Only declare the columns you actually need to reference
export const supabaseAuthUser = authSchema.table("users", {
    id: uuid("id").primaryKey(),
    email: text("email"),
});