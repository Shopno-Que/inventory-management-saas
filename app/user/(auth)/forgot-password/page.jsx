import Link from "next/link";
import { redirect } from "next/navigation";

import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { createClient } from "@/lib/supabase/server";

export default async function ForgotPasswordPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/user/profile");
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-base-content">
          পাসওয়ার্ড রিসেট করুন
        </h1>

        <p className="text-sm text-base-content/60">
          আপনার ইমেইল দিন, আমরা পাসওয়ার্ড রিসেট করার নির্দেশনা পাঠাব।
        </p>
      </header>

      <ForgotPasswordForm />

      <p className="text-center text-sm text-base-content/60">
        পাসওয়ার্ড মনে পড়েছে?{" "}
        <Link href="/user/login" className="link link-primary font-medium">
          সাইন ইন করুন
        </Link>
      </p>
    </div>
  );
}
