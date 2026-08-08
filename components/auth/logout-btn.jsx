"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const logout = async () => {
    const supabase = createClient();
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/user/login");
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline"
        onClick={logout}
        disabled={loading}
      >
        {loading && <span className="loading loading-bars loading-sm"></span>}
        লগ আউট
      </button>
    </>
  );
}
