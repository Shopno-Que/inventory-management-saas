"use client";

import { FcGoogle } from "react-icons/fc";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function signInWithGoogle() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/user/auth/callback`,
      },
    });
  }

  return (
    <button
      disabled={loading}
      onClick={signInWithGoogle}
      className="btn btn-outline w-full justify-center gap-3"
      type="button"
    >
      {loading && <span className="loading loading-bars loading-sm"></span>}
      <FcGoogle aria-hidden="true" className="text-xl" />
      Google দিয়ে কন্টিনিউ করুন
    </button>
  );
}
