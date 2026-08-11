"use client";

import { useNavigation } from "@/components/navigation/NavigationProvider"; import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const { push } = useNavigation();

  const [loading, setLoading] = useState(false);

  const logout = async () => {
    const supabase = createClient();
    setLoading(true);
    await supabase.auth.signOut();
    push("/user/login");
    setLoading(false);
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
