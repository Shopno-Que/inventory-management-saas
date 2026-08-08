import { redirect } from "next/navigation";
import ProfileShell from "@/components/user/profile-shell";
import { createClient } from "@/lib/supabase/server";

export default async function ProfileLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/user/login");

  return (
    <ProfileShell
      user={{
        email: user.email || "",
        name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      }}
    >
      {children}
    </ProfileShell>
  );
}
