import { boolean,index,numeric,pgTable,text,timestamp,unique,uuid,varchar } from "drizzle-orm/pg-core";
import { supabaseAuthUser } from "../ref-schema";

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

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    sku: varchar("sku", { length: 100 }),
    barcode: varchar("barcode", { length: 100 }),
    description: text("description"),
    unit: varchar("unit", { length: 40 }).notNull().default("piece"),
    costPrice: numeric("cost_price", { precision: 12, scale: 2 }),
    salePrice: numeric("sale_price", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("products_store_id_idx").on(table.storeId),
    unique("products_store_sku_unique").on(table.storeId, table.sku),
  ],
);

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 40 }),
    company: varchar("company", { length: 200 }),
    notes: text("notes"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("customers_store_id_idx").on(table.storeId),
    unique("customers_store_email_unique").on(table.storeId, table.email),
  ],
);

export const sales = pgTable(
  "sales",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
    saleDate: timestamp("sale_date", { withTimezone: true })
      .notNull()
      .defaultNow(),
    dueDate: timestamp("due_date", { withTimezone: true }),
    status: varchar("status", { length: 30 }).notNull().default("paid"),
    itemDescription: text("item_description").notNull(),
    quantity: numeric("quantity", { precision: 12, scale: 2 })
      .notNull()
      .default("1"),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    tax: numeric("tax", { precision: 12, scale: 2 }).notNull().default("0"),
    discount: numeric("discount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("sales_store_id_idx").on(table.storeId),
    unique("sales_store_invoice_number_unique").on(
      table.storeId,
      table.invoiceNumber,
    ),
  ],
);

export const expenses = pgTable(
  "expenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    category: varchar("category", { length: 80 }),
    vendor: varchar("vendor", { length: 200 }),
    amount: numeric("amount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    expenseDate: timestamp("expense_date", { withTimezone: true })
      .notNull()
      .defaultNow(),
    paymentMethod: varchar("payment_method", { length: 50 }),
    status: varchar("status", { length: 30 }).notNull().default("paid"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("expenses_store_id_idx").on(table.storeId)],
);
