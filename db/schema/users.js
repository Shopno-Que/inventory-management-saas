import {pgTable,uuid,varchar,text,timestamp,boolean,unique} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const supabaseAuthUser = pgTable("supabase_auth_user", {
    id: uuid("id").primaryKey(),
});
