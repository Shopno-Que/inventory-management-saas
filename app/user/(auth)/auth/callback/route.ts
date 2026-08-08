import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const destination = new URL("/user/profile", request.url);

  if (!code) {
    destination.pathname = "/user/login";
    destination.searchParams.set(
      "error",
      "OAuth callback did not include a code.",
    );
    return NextResponse.redirect(destination);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    destination.pathname = "/user/login";
    destination.searchParams.set("error", error.message);
  }

  return NextResponse.redirect(destination);
}
