"use client";

import { FcGoogle } from "react-icons/fc";
import { createClient } from "@/lib/supabase/client";

export default function GoogleButton() {
  const supabase = createClient();

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/user/auth/callback`,
      },
    });
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="btn btn-outline w-full justify-center gap-3"
      type="button"
    >
      <FcGoogle aria-hidden="true" className="text-xl" />
      Google দিয়ে কন্টিনিউ করুন
    </button>
  );
}
