"use server";

import { and, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { products } from "@/db/schema/store";
import { storeMembers, stores } from "@/db/schema/store";
import { createClient } from "@/lib/supabase/server";

function textValue(formData, name, maxLength) {
  const value = formData.get(name)?.trim();
  return value && value.length <= maxLength ? value : null;
}

function priceValue(formData, name, required = false) {
  const rawValue = formData.get(name)?.trim();

  if (!rawValue) return required ? null : undefined;

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
    `/stores/${storeSlug}/products${destination}?error=${encodeURIComponent(message)}`,
  );
}

function productValues(formData, storeSlug, destination) {
  const name = textValue(formData, "name", 200);
  const sku = textValue(formData, "sku", 100);
  const barcode = textValue(formData, "barcode", 100);
  const unit = textValue(formData, "unit", 40);
  const description = textValue(formData, "description", 5000);
  const salePrice = priceValue(formData, "salePrice", true);
  const costPrice = priceValue(formData, "costPrice");

  if (!name)
    validationError(
      storeSlug,
      destination,
      "Product name is required and must be 200 characters or fewer.",
    );
  if (!unit)
    validationError(
      storeSlug,
      destination,
      "Unit is required and must be 40 characters or fewer.",
    );
  if (!salePrice)
    validationError(storeSlug, destination, "Enter a valid sale price.");
  if (costPrice === null)
    validationError(storeSlug, destination, "Enter a valid cost price.");

  return {
    name,
    sku,
    barcode,
    description,
    unit,
    salePrice,
    costPrice,
    isActive: formData.get("isActive") === "on",
    updatedAt: new Date(),
  };
}

function databaseError(storeSlug, destination, error) {
  if (error?.code === "23505") {
    validationError(
      storeSlug,
      destination,
      "That SKU is already in use for this store.",
    );
  }

  validationError(
    storeSlug,
    destination,
    "We could not save this product. Please try again.",
  );
}

export async function createProduct(formData) {
  const storeSlug = formData.get("storeSlug");
  if (!storeSlug) redirect("/user/profile/stores");

  const storeId = await accessibleStoreId(storeSlug);
  const values = productValues(formData, storeSlug, "/new");

  try {
    await db.insert(products).values({ storeId, ...values });
  } catch (error) {
    databaseError(storeSlug, "/new", error);
  }

  revalidatePath(`/stores/${storeSlug}/products`);
  redirect(`/stores/${storeSlug}/products`);
}

export async function updateProduct(formData) {
  const storeSlug = formData.get("storeSlug");
  const productId = formData.get("productId");
  if (!storeSlug || !productId) redirect("/user/profile/stores");

  const storeId = await accessibleStoreId(storeSlug);
  const destination = `/${productId}/edit`;
  const values = productValues(formData, storeSlug, destination);

  try {
    const updated = await db
      .update(products)
      .set(values)
      .where(and(eq(products.id, productId), eq(products.storeId, storeId)))
      .returning({ id: products.id });

    if (updated.length === 0)
      validationError(storeSlug, destination, "Product not found.");
  } catch (error) {
    databaseError(storeSlug, destination, error);
  }

  revalidatePath(`/stores/${storeSlug}/products`);
  redirect(`/stores/${storeSlug}/products`);
}

export async function deleteProduct(formData) {
  const storeSlug = formData.get("storeSlug");
  const productId = formData.get("productId");
  if (!storeSlug || !productId) redirect("/user/profile/stores");

  const storeId = await accessibleStoreId(storeSlug);
  const deleted = await db
    .delete(products)
    .where(and(eq(products.id, productId), eq(products.storeId, storeId)))
    .returning({ id: products.id });

  if (deleted.length === 0) {
    validationError(storeSlug, `/${productId}/delete`, "Product not found.");
  }

  revalidatePath(`/stores/${storeSlug}/products`);
  redirect(`/stores/${storeSlug}/products`);
}
