"use server";

import { and, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { sales } from "@/db/schema/store";
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
    `/stores/${storeSlug}/sales${destination}?error=${encodeURIComponent(message)}`,
  );
}

function saleValues(formData, storeSlug, destination) {
  const invoiceNumber = textValue(formData, "invoiceNumber", 50);
  const itemDescription = textValue(formData, "itemDescription", 5000);
  const status = (formData.get("status")?.toString().trim() || "paid").slice(
    0,
    30,
  );
  const notes = textValue(formData, "notes", 5000);
  const customerId = formData.get("customerId")?.toString().trim() || null;
  const quantity = numericValue(formData, "quantity", true);
  const unitPrice = numericValue(formData, "unitPrice", true);
  const tax = numericValue(formData, "tax");
  const discount = numericValue(formData, "discount");

  if (!invoiceNumber) {
    validationError(storeSlug, destination, "Invoice number is required.");
  }

  if (!itemDescription) {
    validationError(storeSlug, destination, "Item description is required.");
  }

  if (quantity === null) {
    validationError(
      storeSlug,
      destination,
      "Quantity must be a valid positive number.",
    );
  }

  if (unitPrice === null) {
    validationError(
      storeSlug,
      destination,
      "Unit price must be a valid positive number.",
    );
  }

  if (tax === null) {
    validationError(
      storeSlug,
      destination,
      "Tax must be a valid non-negative number.",
    );
  }

  if (discount === null) {
    validationError(
      storeSlug,
      destination,
      "Discount must be a valid non-negative number.",
    );
  }

  const subtotalValue = Number(quantity) * Number(unitPrice);
  const subtotal = subtotalValue.toFixed(2);
  const total = (subtotalValue + Number(tax) - Number(discount)).toFixed(2);

  return {
    customerId: customerId || null,
    invoiceNumber,
    status,
    itemDescription,
    quantity,
    unitPrice,
    subtotal,
    tax,
    discount,
    total,
    notes,
    dueDate: formData.get("dueDate")
      ? new Date(formData.get("dueDate").toString())
      : null,
    saleDate: formData.get("saleDate")
      ? new Date(formData.get("saleDate").toString())
      : new Date(),
    updatedAt: new Date(),
  };
}

function databaseError(storeSlug, destination, error) {
  if (error?.code === "23505") {
    validationError(
      storeSlug,
      destination,
      "That invoice number is already in use for this store.",
    );
  }

  validationError(
    storeSlug,
    destination,
    "We could not save this sale. Please try again.",
  );
}

export async function createSale(formData) {
  const storeSlug = formData.get("storeSlug");
  if (!storeSlug) redirect("/user/profile/stores");

  const storeId = await accessibleStoreId(String(storeSlug));
  const values = saleValues(formData, String(storeSlug), "/new");

  try {
    await db.insert(sales).values({ storeId, ...values });
  } catch (error) {
    databaseError(String(storeSlug), "/new", error);
  }

  revalidatePath(`/stores/${storeSlug}/sales`);
  redirect(`/stores/${storeSlug}/sales`);
}

export async function updateSale(formData) {
  const storeSlug = formData.get("storeSlug");
  const saleId = formData.get("saleId");
  if (!storeSlug || !saleId) redirect("/user/profile/stores");

  const storeId = await accessibleStoreId(String(storeSlug));
  const destination = `/${saleId}/edit`;
  const values = saleValues(formData, String(storeSlug), destination);

  try {
    const updated = await db
      .update(sales)
      .set(values)
      .where(and(eq(sales.id, saleId), eq(sales.storeId, storeId)))
      .returning({ id: sales.id });

    if (updated.length === 0) {
      validationError(String(storeSlug), destination, "Sale not found.");
    }
  } catch (error) {
    databaseError(String(storeSlug), destination, error);
  }

  revalidatePath(`/stores/${storeSlug}/sales`);
  redirect(`/stores/${storeSlug}/sales`);
}

export async function deleteSale(formData) {
  const storeSlug = formData.get("storeSlug");
  const saleId = formData.get("saleId");
  if (!storeSlug || !saleId) redirect("/user/profile/stores");

  const storeId = await accessibleStoreId(String(storeSlug));
  const deleted = await db
    .delete(sales)
    .where(and(eq(sales.id, saleId), eq(sales.storeId, storeId)))
    .returning({ id: sales.id });

  if (deleted.length === 0) {
    validationError(String(storeSlug), `/${saleId}/delete`, "Sale not found.");
  }

  revalidatePath(`/stores/${storeSlug}/sales`);
  redirect(`/stores/${storeSlug}/sales`);
}
