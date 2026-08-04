import Link from "next/link";
import { redirect } from "next/navigation";
import GoogleButton from "@/components/auth/google-login-btn";
import SignupForm from "@/components/auth/signup-form";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-base-content">
          নতুন অ্যাকাউন্ট তৈরি করুন
        </h1>
      </header>

      <SignupForm/>

      <div className="divider">অথবা</div>

      <GoogleButton />

      <p className="text-center text-sm text-base-content/60">
        আগে থেকেই অ্যাকাউন্ট আছে?{" "}
        <Link className="link link-primary font-medium" href="/user/login">
          সাইন ইন করুন
        </Link>
      </p>
    </div>);
}
