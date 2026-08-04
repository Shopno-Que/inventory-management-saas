import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/logout-btn";

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
            <Link className="btn btn-primary" href="/dashboard">
              Dashboard
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