import { createClient } from "@/lib/supabase/server";
import StoreOnboarding from "@/components/store/StoreOnboarding";

export const metadata = {
    title: "নতুন স্টোর | হিসাব খাতা",
};

export default async function Page() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <main className="container mx-auto max-w-3xl p-6">
            <StoreOnboarding
                user={
                    user
                        ? {
                            id: user.id,
                            email: user.email,
                        }
                        : null
                }
            />
        </main>
    );
}