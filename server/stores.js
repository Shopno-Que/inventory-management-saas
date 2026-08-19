"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { stores } from "@/db/schema/stores";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateStoreName(prevState, formData) {
    const storeSlug = formData.get("storeSlug");
    const name = formData.get("name");

    if (!storeSlug) {
        return {
            error: "Store slug is missing.",
            success: "",
        };
    }

    const normalizedName = String(name || "").trim();

    if (
        normalizedName.length < 2 ||
        normalizedName.length > 200
    ) {
        return {
            error: "Store name must be between 2 and 200 characters.",
            success: "",
        };
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/user/login");
    }

    const [store] = await db
        .select({
            id: stores.id,
        })
        .from(stores)
        .where(
            and(
                eq(stores.slug, storeSlug),
                eq(stores.ownerId, user.id),
            ),
        )
        .limit(1);

    if (!store) {
        return {
            error: "Store not found.",
            success: "",
        };
    }

    await db
        .update(stores)
        .set({
            name: normalizedName,
            updatedAt: new Date(),
        })
        .where(eq(stores.id, store.id));

    revalidatePath(`/stores/${storeSlug}/settings`);

    return {
        error: "",
        success: "Store name updated successfully.",
    };
}

export async function updateStoreRegionalSettings(
    prevState,
    formData,
) {
    const storeSlug = formData.get("storeSlug");
    const countryCode = formData.get("countryCode");
    const currencyCode = formData.get("currencyCode");
    const timezone = formData.get("timezone");

    if (!storeSlug) {
        return {
            error: "Store slug is missing.",
            success: "",
        };
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/user/login");
    }

    const normalizedCountryCode = String(
        countryCode || "",
    )
        .trim()
        .toUpperCase();

    const normalizedCurrencyCode = String(
        currencyCode || "",
    )
        .trim()
        .toUpperCase();

    const normalizedTimezone = String(
        timezone || "",
    ).trim();

    if (
        normalizedCountryCode &&
        normalizedCountryCode.length !== 2
    ) {
        return {
            error: "Country code must contain 2 characters.",
            success: "",
        };
    }

    if (
        normalizedCurrencyCode &&
        normalizedCurrencyCode.length !== 3
    ) {
        return {
            error: "Currency code must contain 3 characters.",
            success: "",
        };
    }

    const [store] = await db
        .select({
            id: stores.id,
        })
        .from(stores)
        .where(
            and(
                eq(stores.slug, storeSlug),
                eq(stores.ownerId, user.id),
            ),
        )
        .limit(1);

    if (!store) {
        return {
            error: "Store not found.",
            success: "",
        };
    }

    await db
        .update(stores)
        .set({
            countryCode: normalizedCountryCode || null,
            currencyCode: normalizedCurrencyCode || null,
            timezone: normalizedTimezone || null,
            updatedAt: new Date(),
        })
        .where(eq(stores.id, store.id));

    revalidatePath(`/stores/${storeSlug}/settings`);

    return {
        error: "",
        success: "Regional settings updated successfully.",
    };
}

export async function deleteStore(prevState, formData) {
    const storeSlug = formData.get("storeSlug");
    const confirmation = String(
        formData.get("confirmation") || "",
    ).trim();

    if (!storeSlug) {
        return {
            error: "Store slug is missing.",
            success: "",
        };
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/user/login");
    }

    const [store] = await db
        .select({
            id: stores.id,
            name: stores.name,
        })
        .from(stores)
        .where(
            and(
                eq(stores.slug, storeSlug),
                eq(stores.ownerId, user.id),
            ),
        )
        .limit(1);

    if (!store) {
        return {
            error: "Store not found.",
            success: "",
        };
    }

    if (confirmation !== store.name) {
        return {
            error: "Store name confirmation does not match.",
            success: "",
        };
    }

    await db
        .delete(stores)
        .where(eq(stores.id, store.id));

    redirect("/user/profile/stores");
}