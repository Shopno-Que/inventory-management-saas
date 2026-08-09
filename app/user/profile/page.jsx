import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/user/ProfileForm";

export const metadata = {
  title: "প্রোফাইল | হিসাব খাতা",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const name = user.user_metadata?.full_name || "";

  const email = user.email || "";

  return (
    <main className="container mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <p className="text-sm text-base-content/55">অ্যাকাউন্ট</p>

        <h1 className="text-2xl font-bold">
          আমার প্রোফাইল
        </h1>

        <p className="mt-1 text-base-content/60">
          আপনার তথ্য ও অ্যাকাউন্ট সেটিংস পরিচালনা করুন।
        </p>
      </div>

      <ProfileForm
        name={name}
        email={email}
      />
    </main>
  );
}
