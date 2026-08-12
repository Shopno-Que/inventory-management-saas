"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import {
    stores,
    storeMembers,
} from "@/db/schema/stores";
import { createDefaultStoreRoles } from "@/db/store-default-roles";
import { initialState } from "@/components/store/StoreOnboarding";

export async function createStore(prevState, formData) {
    const supabase = await createClient();

    const {
        data: { user: currentUser },
    } = await supabase.auth.getUser();

    /*
     * Required store information.
     */
    const name = formData
        .get("name")
        ?.trim();

    const slug = formData
        .get("slug")
        ?.trim()
        .toLowerCase();

    /*
     * Optional store information.
     * Empty values are stored as null.
     */
    const logoUrl =
        formData.get("logoUrl")?.trim() || null;

    const countryCode =
        formData
            .get("countryCode")
            ?.trim()
            .toUpperCase() || null;

    const currencyCode =
        formData
            .get("currencyCode")
            ?.trim()
            .toUpperCase() || null;

    const timezone =
        formData.get("timezone")?.trim() || null;

    /*
     * Validate required store information.
     */
    if (
        !name ||
        name.length < 2 ||
        name.length > 100
    ) {
        return {
            ...initialState,
            error:
                "স্টোরের নাম ২ থেকে ১০০ অক্ষরের মধ্যে হতে হবে।",
        };
    }

    if (
        !slug ||
        slug.length < 2 ||
        slug.length > 100 ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    ) {
        return {
            ...initialState,
            error:
                "স্টোর URL সঠিকভাবে প্রদান করুন।",
        };
    }

    /*
     * Validate optional store information
     * only when a value has been provided.
     */
    if (
        countryCode &&
        !/^[A-Z]{2}(?:-[A-Z]{2})?$/.test(
            countryCode,
        )
    ) {
        return {
            ...initialState,
            error:
                "দেশ / অঞ্চলের তথ্য সঠিক নয়।",
        };
    }

    if (
        currencyCode &&
        !/^[A-Z]{3}$/.test(currencyCode)
    ) {
        return {
            ...initialState,
            error:
                "কারেন্সির তথ্য সঠিক নয়।",
        };
    }

    if (
        timezone &&
        timezone.length > 100
    ) {
        return {
            ...initialState,
            error:
                "টাইমজোনের তথ্য সঠিক নয়।",
        };
    }

    let user = currentUser;
    let requiresConfirmation = false;

    /*
     * New user registration.
     */
    if (!user) {
        /*
         * Full name is optional.
         */
        const fullName =
            formData.get("fullName")?.trim() || null;

        /*
         * Email, password and confirmation
         * are required for a new account.
         */
        const email = formData
            .get("email")
            ?.trim()
            .toLowerCase();

        const password =
            formData.get("password");

        const confirmPassword =
            formData.get("confirmPassword");

        /*
         * Validate optional full name
         * only when provided.
         */
        if (
            fullName &&
            (
                fullName.length < 2 ||
                fullName.length > 100
            )
        ) {
            return {
                ...initialState,
                error:
                    "পূর্ণ নাম ২ থেকে ১০০ অক্ষরের মধ্যে হতে হবে।",
            };
        }

        /*
         * Email is required.
         */
        if (!email) {
            return {
                ...initialState,
                error:
                    "ইমেইল প্রয়োজন।",
            };
        }

        /*
         * Basic server-side email validation.
         */
        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                email,
            )
        ) {
            return {
                ...initialState,
                error:
                    "একটি সঠিক ইমেইল ঠিকানা প্রদান করুন।",
            };
        }

        /*
         * Password is required.
         */
        if (
            !password ||
            password.length < 6
        ) {
            return {
                ...initialState,
                error:
                    "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
            };
        }

        /*
         * Password confirmation is required
         * and must match the password.
         */
        if (!confirmPassword) {
            return {
                ...initialState,
                error:
                    "পাসওয়ার্ড পুনরায় লিখুন।",
            };
        }

        if (password !== confirmPassword) {
            return {
                ...initialState,
                error:
                    "পাসওয়ার্ড দুটি একই নয়।",
            };
        }

        /*
         * Create Supabase account.
         */
        const { data, error } =
            await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo:
                        `${process.env.NEXT_PUBLIC_SITE_URL}/user/auth/confirm`,
                },
            });

        if (error) {

            return {
                ...initialState,
                error:
                    "অ্যাকাউন্ট তৈরি করা যায়নি। ইমেইলটি হয়তো ইতোমধ্যে ব্যবহার করা হয়েছে।",
            };
        }

        if (!data.user) {
            return {
                ...initialState,
                error:
                    "অ্যাকাউন্ট তৈরি করা যায়নি।",
            };
        }

        user = data.user;

        /*
         * New users must verify their email
         * before accessing the store.
         */
        requiresConfirmation = true;
    }

    try {
        const result = await db.transaction(
            async (tx) => {
                /*
                 * Create store.
                 */
                const [store] = await tx
                    .insert(stores)
                    .values({
                        name,
                        ownerId: user.id,
                        slug,
                        logoUrl,
                        countryCode,
                        currencyCode,
                        timezone,
                        isActive:
                            !requiresConfirmation,
                    })
                    .returning({
                        id: stores.id,
                    });

                if (!store) {
                    throw new Error(
                        "Store was not created.",
                    );
                }

                /*
                 * Create owner/member relationship.
                 */
                const [member] = await tx
                    .insert(storeMembers)
                    .values({
                        storeId: store.id,
                        userId: user.id,
                        status:
                            requiresConfirmation
                                ? "pending"
                                : "active",
                        joinedAt:
                            requiresConfirmation
                                ? null
                                : new Date(),
                    })
                    .returning({
                        id: storeMembers.id,
                    });

                if (!member) {
                    throw new Error(
                        "Store member was not created.",
                    );
                }

                /*
                 * Create default store roles
                 * and their permissions.
                 */
                await createDefaultStoreRoles(
                    store.id,
                    tx,
                );

                return {
                    storeId: store.id,
                };
            },
        );

        return {
            success: true,
            error: null,
            storeId: result.storeId,
            storeSlug: slug,
            requiresConfirmation,
        };
    } catch (error) {

        return {
            ...initialState,
            error:
                "স্টোর তৈরি করা যায়নি। আবার চেষ্টা করুন।",
        };
    }
}

export async function checkSlugAvailability(slug) {
    const normalizedSlug = slug.trim().toLowerCase();

    if (
        normalizedSlug.length < 2 ||
        normalizedSlug.length > 100 ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)
    ) {
        return {
            available: false,
            reason: "invalid",
        };
    }

    const existingStore = await db
        .select({ id: stores.id })
        .from(stores)
        .where(eq(stores.slug, normalizedSlug))
        .limit(1);

    return {
        available: existingStore.length === 0,
        reason: existingStore.length === 0
            ? null
            : "taken",
    };
}