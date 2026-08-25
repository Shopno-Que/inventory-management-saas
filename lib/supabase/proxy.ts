import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const protectedRoutePrefixes = ["/user/profile", "/stores", "/admin"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(
            ({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Keep this immediately after createServerClient.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const { pathname } = request.nextUrl;

  const requiresAuthentication =
    protectedRoutePrefixes.some(
      (prefix) =>
        pathname === prefix ||
        pathname.startsWith(`${prefix}/`),
    );

  if (requiresAuthentication && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/user/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}