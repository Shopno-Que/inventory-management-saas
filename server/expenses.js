"use server";

import { and, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { expenses } from "@/db/schema/store";
import { storeMembers, stores } from "@/db/schema/store";
import { createClient } from "@/lib/supabase/server";

function textValue(formData, name, maxLength) {
  const value = formData.get(name)?.toString().trim();
  return value && value.length <= maxLength ? value : null;
}

function numericValue(formData, name, required = false) {
  const rawValue = formData.get(name)?.toString().trim();
  if (!rawValue) return required ? null : "0";

  const value = Number(rawValue);
  if (!Number.isFinite(value) || value < 0) return null;

  return value.toFixed(2);
}

async function accessibleStoreId(slug) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/user/login");

  const [store] = await db
    .select({ id: stores.id })
    .from(stores)
    .leftJoin(
      storeMembers,
      and(
        eq(storeMembers.storeId, stores.id),
        eq(storeMembers.userId, user.id),
      ),
    )
    .where(
      and(
        eq(stores.slug, slug),
        or(eq(stores.ownerId, user.id), eq(storeMembers.userId, user.id)),
      ),
    )
    .limit(1);

  if (!store) redirect("/user/profile/stores");

  return store.id;
}

function validationError(storeSlug, destination, message) {
  redirect(
    `/stores/${storeSlug}/expenses${destination}?error=${encodeURIComponent(message)}`,
  );
}

function expenseValues(formData, storeSlug, destination) {
  const title = textValue(formData, "title", 200);
  const category = textValue(formData, "category", 80);
  const vendor = textValue(formData, "vendor", 200);
  const paymentMethod = textValue(formData, "paymentMethod", 50);
  const notes = textValue(formData, "notes", 5000);
  const amount = numericValue(formData, "amount", true);
  const status = (formData.get("status")?.toString().trim() || "paid").slice(
    0,
    30,
  );

  if (!title) {
    validationError(storeSlug, destination, "Expense title is required.");
  }

  if (amount === null) {
    validationError(
      storeSlug,
      destination,
      "Amount must be a valid non-negative number.",
    );
  }

  return {
    title,
    category,
    vendor,
    amount,
    paymentMethod,
    status,
    notes,
    expenseDate: formData.get("expenseDate")
      ? new Date(formData.get("expenseDate").toString())
      : new Date(),
    updatedAt: new Date(),
  };
}

function databaseError(storeSlug, destination, _error) {
  validationError(
    storeSlug,
    destination,
    "We could not save this expense. Please try again.",
  );
}

export async function createExpense(formData) {
  const storeSlug = formData.get("storeSlug");
  if (!storeSlug) redirect("/user/profile/stores");

  const storeId = await accessibleStoreId(String(storeSlug));
  const values = expenseValues(formData, String(storeSlug), "/new");

  try {
    await db.insert(expenses).values({ storeId, ...values });
  } catch (error) {
    databaseError(String(storeSlug), "/new", error);
  }

  revalidatePath(`/stores/${storeSlug}/expenses`);
  redirect(`/stores/${storeSlug}/expenses`);
}

export async function updateExpense(formData) {
  const storeSlug = formData.get("storeSlug");
  const expenseId = formData.get("expenseId");
  if (!storeSlug || !expenseId) redirect("/user/profile/stores");

  const storeId = await accessibleStoreId(String(storeSlug));
  const destination = `/${expenseId}/edit`;
  const values = expenseValues(formData, String(storeSlug), destination);

  try {
    const updated = await db
      .update(expenses)
      .set(values)
      .where(and(eq(expenses.id, expenseId), eq(expenses.storeId, storeId)))
      .returning({ id: expenses.id });

    if (updated.length === 0) {
      validationError(String(storeSlug), destination, "Expense not found.");
    }
  } catch (error) {
    databaseError(String(storeSlug), destination, error);
  }

  revalidatePath(`/stores/${storeSlug}/expenses`);
  redirect(`/stores/${storeSlug}/expenses`);
}

export async function deleteExpense(formData) {
  const storeSlug = formData.get("storeSlug");
  const expenseId = formData.get("expenseId");
  if (!storeSlug || !expenseId) redirect("/user/profile/stores");

  const storeId = await accessibleStoreId(String(storeSlug));
  const deleted = await db
    .delete(expenses)
    .where(and(eq(expenses.id, expenseId), eq(expenses.storeId, storeId)))
    .returning({ id: expenses.id });

  if (deleted.length === 0) {
    validationError(
      String(storeSlug),
      `/${expenseId}/delete`,
      "Expense not found.",
    );
  }

  revalidatePath(`/stores/${storeSlug}/expenses`);
  redirect(`/stores/${storeSlug}/expenses`);
}
