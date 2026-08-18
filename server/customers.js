"use server";

import { and, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { customers } from "@/db/schema/store";
import { storeMembers, stores } from "@/db/schema/stores";
import { createClient } from "@/lib/supabase/server";

function textValue(formData, name, maxLength) {
  const value = formData.get(name)?.toString().trim();
  return value && value.length <= maxLength ? value : null;
}

function emailValue(formData, name, maxLength) {
  const value = formData.get(name)?.toString().trim();
  if (!value) return undefined;
  if (value.length > maxLength) return null;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value) ? value : null;
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
    `/stores/${storeSlug}/customers${destination}?error=${encodeURIComponent(message)}`,
  );
}

function customerValues(formData, storeSlug, destination) {
  const name = textValue(formData, "name", 200);
  const email = emailValue(formData, "email", 255);
  const phone = textValue(formData, "phone", 40);
  const company = textValue(formData, "company", 200);
  const notes = textValue(formData, "notes", 5000);

  if (!name) {
    validationError(
      storeSlug,
      destination,
      "Customer name is required and must be 200 characters or fewer.",
    );
  }

  if (email === null) {
    validationError(storeSlug, destination, "Enter a valid email address.");
  }

  if (phone === null) {
    validationError(
      storeSlug,
      destination,
      "Phone number must be 40 characters or fewer.",
    );
  }

  if (company === null) {
    validationError(
      storeSlug,
      destination,
      "Company name must be 200 characters or fewer.",
    );
  }

  if (notes === null) {
    validationError(
      storeSlug,
      destination,
      "Notes must be 5000 characters or fewer.",
    );
  }

  return {
    name,
    email,
    phone,
    company,
    notes,
    isActive: formData.get("isActive") === "on",
    updatedAt: new Date(),
  };
}

function databaseError(storeSlug, destination, error) {
  if (error?.code === "23505") {
    validationError(
      storeSlug,
      destination,
      "That email is already in use for this store.",
    );
  }

  validationError(
    storeSlug,
    destination,
    "We could not save this customer. Please try again.",
  );
}

export async function createCustomer(formData) {
  const storeSlug = formData.get("storeSlug");
  if (!storeSlug) redirect("/user/profile/stores");

  const storeId = await accessibleStoreId(String(storeSlug));
  const values = customerValues(formData, String(storeSlug), "/new");

  try {
    await db.insert(customers).values({ storeId, ...values });
  } catch (error) {
    databaseError(String(storeSlug), "/new", error);
  }

  revalidatePath(`/stores/${storeSlug}/customers`);
  redirect(`/stores/${storeSlug}/customers`);
}

export async function updateCustomer(formData) {
  const storeSlug = formData.get("storeSlug");
  const customerId = formData.get("customerId");
  if (!storeSlug || !customerId) redirect("/user/profile/stores");

  const storeId = await accessibleStoreId(String(storeSlug));
  const destination = `/${customerId}/edit`;
  const values = customerValues(formData, String(storeSlug), destination);

  try {
    const updated = await db
      .update(customers)
      .set(values)
      .where(and(eq(customers.id, customerId), eq(customers.storeId, storeId)))
      .returning({ id: customers.id });

    if (updated.length === 0) {
      validationError(String(storeSlug), destination, "Customer not found.");
    }
  } catch (error) {
    databaseError(String(storeSlug), destination, error);
  }

  revalidatePath(`/stores/${storeSlug}/customers`);
  redirect(`/stores/${storeSlug}/customers`);
}

export async function deleteCustomer(formData) {
  const storeSlug = formData.get("storeSlug");
  const customerId = formData.get("customerId");
  if (!storeSlug || !customerId) redirect("/user/profile/stores");

  const storeId = await accessibleStoreId(String(storeSlug));
  const deleted = await db
    .delete(customers)
    .where(and(eq(customers.id, customerId), eq(customers.storeId, storeId)))
    .returning({ id: customers.id });

  if (deleted.length === 0) {
    validationError(
      String(storeSlug),
      `/${customerId}/delete`,
      "Customer not found.",
    );
  }

  revalidatePath(`/stores/${storeSlug}/customers`);
  redirect(`/stores/${storeSlug}/customers`);
}
