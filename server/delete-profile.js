"use server";

import { eq, and, count } from "drizzle-orm";
import { db } from "@/db";
import { saasMembers, saasMemberRoles, saasRoles } from "@/db/schema/saas";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function deleteAccountAction(prevState, formData) {
    const confirmation = formData.get("confirmation");

    if (confirmation !== "DELETE") {
        return {
            success: false,
            message: "অ্যাকাউন্ট মুছে ফেলার জন্য DELETE লিখুন।",
        };
    }

    // Get the currently authenticated user
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            success: false,
            message: "আপনার সেশন পাওয়া যায়নি। আবার লগইন করুন।",
        };
    }

    // Check whether the user is a SaaS admin
    const adminRole = await db
        .select({
            memberId: saasMembers.id,
        })
        .from(saasMembers)
        .innerJoin(
            saasMemberRoles,
            eq(saasMemberRoles.memberId, saasMembers.id),
        )
        .innerJoin(
            saasRoles,
            eq(saasRoles.id, saasMemberRoles.roleId),
        )
        .where(
            and(
                eq(saasMembers.userId, user.id),
                eq(saasRoles.code, "admin"),
            ),
        )
        .limit(1);

    // If user is an admin, make sure another admin exists
    if (adminRole.length > 0) {
        const adminCount = await db
            .select({
                count: count(),
            })
            .from(saasMembers)
            .innerJoin(
                saasMemberRoles,
                eq(saasMemberRoles.memberId, saasMembers.id),
            )
            .innerJoin(
                saasRoles,
                eq(saasRoles.id, saasMemberRoles.roleId),
            )
            .where(
                eq(saasRoles.code, "admin"),
            );

        if (Number(adminCount[0].count) <= 1) {
            return {
                success: false,
                message:
                    "আপনি একমাত্র SaaS admin। অন্য একজন admin তৈরি না করা পর্যন্ত আপনার অ্যাকাউন্ট মুছতে পারবেন না।",
            };
        }
    }

    // Delete the Supabase Auth user.
    // Database foreign keys with ON DELETE CASCADE
    // will clean up the related application data.
    const adminSupabase = createAdminClient();

    const { error: deleteError } =
        await adminSupabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
        return {
            success: false,
            message:
                "অ্যাকাউন্ট মুছে ফেলা যায়নি। আবার চেষ্টা করুন।",
        };
    }

    redirect("/user/login?deleted=true");
}