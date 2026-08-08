import Link from "next/link";
import LogoutButton from "@/components/auth/logout-btn";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      <div className="flex min-h-screen items-center justify-center gap-4">
        {user ? (
          <>
            <Link className="btn btn-primary" href="/user/profile">
              Profile
            </Link>

            <LogoutButton />
          </>
        ) : (
          <>
            <Link className="btn" href="/user/login">
              Login
            </Link>

            <Link className="btn btn-primary" href="/user/register">
              Register
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
