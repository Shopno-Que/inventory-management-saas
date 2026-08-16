import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next =
    request.nextUrl.searchParams.get("next");

  const destination = new URL(
    next || "/user/profile",
    request.url,
  );

  if (!code) {
    destination.pathname = "/user/login";
    destination.searchParams.set(
      "error",
      "OAuth callback did not include a code.",
    );

    return NextResponse.redirect(destination);
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(
      code,
    );

  if (error) {
    const errorDestination = new URL(
      "/user/login",
      request.url,
    );

    errorDestination.searchParams.set(
      "error",
      error.message,
    );

    return NextResponse.redirect(
      errorDestination,
    );
  }

  return NextResponse.redirect(destination);
}