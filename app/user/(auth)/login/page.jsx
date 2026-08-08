import Link from "next/link";
import { redirect } from "next/navigation";
import GoogleButton from "@/components/auth/google-login-btn";

import LoginForm from "@/components/auth/login-form";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
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
        <h1 className="text-2xl font-semibold text-base-content">সাইন ইন করুন</h1>
      </header>

      <LoginForm />

      <div className="divider">অথবা</div>

      <GoogleButton />

      <p className="text-center text-sm text-base-content/60">
        নতুন অ্যাকাউন্ট দরকার?{" "}
        <Link className="link link-primary font-medium" href="/user/register">
          সাইন আপ করুন
        </Link>
      </p>
    </div>
  );
}
