import AuthBanner from "@/components/auth/auth-banner";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (user) {
    redirect("/user/profile");
  }

  return (
    <section className="grid min-h-screen bg-base-100 lg:grid-cols-[1.08fr_0.92fr]">
      <AuthBanner />

      <main className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        {children}
      </main>
    </section>
  );
}