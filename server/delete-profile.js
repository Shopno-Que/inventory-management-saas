"use server";
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