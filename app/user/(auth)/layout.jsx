import AuthBanner from "@/components/auth/auth-banner";

export default function AuthLayout({children}) {
  return (
    // Route groups keep auth URLs clean (/user/login, /user/register) while this shared
    // Server Component layout removes duplicated banner and spacing markup.
    <section className="grid min-h-screen bg-base-100 lg:grid-cols-[1.08fr_0.92fr]">
      <AuthBanner />

      <main className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        {children}
      </main>
    </section>
  );
}
